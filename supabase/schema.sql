-- =============================================================
-- AtelierMath — Supabase SQL Schema (MVP)
-- Execute this in Supabase SQL Editor
-- =============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUMS ───────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('teacher', 'student');
CREATE TYPE student_level AS ENUM ('2nde', '1ere', 'terminale', 'autre');
CREATE TYPE homework_status AS ENUM ('assigned', 'submitted', 'reviewed');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'declined', 'cancelled');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- ─── PROFILES (extends auth.users) ──────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'student',
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  level       student_level,
  notes       TEXT DEFAULT '',           -- internal notes (teacher only)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_level ON public.profiles(level);

-- ─── LESSONS ─────────────────────────────────────────────────
CREATE TABLE public.lessons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  content       TEXT DEFAULT '',          -- markdown content
  file_url      TEXT,                     -- optional PDF in Supabase Storage
  target_level  student_level,            -- NULL = all levels
  published     BOOLEAN NOT NULL DEFAULT false,
  created_by    UUID NOT NULL REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lessons_target ON public.lessons(target_level);
CREATE INDEX idx_lessons_published ON public.lessons(published);

-- ─── HOMEWORK ────────────────────────────────────────────────
CREATE TABLE public.homework (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  file_url      TEXT,                     -- optional attachment
  deadline      TIMESTAMPTZ,
  target_level  student_level,            -- NULL = all levels
  target_student UUID REFERENCES public.profiles(id), -- NULL = group/all
  status        homework_status NOT NULL DEFAULT 'assigned',
  created_by    UUID NOT NULL REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_homework_deadline ON public.homework(deadline);
CREATE INDEX idx_homework_target_level ON public.homework(target_level);
CREATE INDEX idx_homework_target_student ON public.homework(target_student);

-- ─── HOMEWORK SUBMISSIONS ────────────────────────────────────
CREATE TABLE public.submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id   UUID NOT NULL REFERENCES public.homework(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES public.profiles(id),
  file_url      TEXT,                     -- student uploaded file
  comment       TEXT DEFAULT '',
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Teacher feedback
  feedback      TEXT,
  grade         TEXT,                     -- e.g. "15/20" or "A"
  reviewed_at   TIMESTAMPTZ,
  UNIQUE(homework_id, student_id)
);

CREATE INDEX idx_submissions_homework ON public.submissions(homework_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);

-- ─── AVAILABILITY (recurring slots) ─────────────────────────
CREATE TABLE public.availability (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES public.profiles(id),
  day         day_of_week NOT NULL,
  start_time  TIME NOT NULL,              -- e.g. '17:00'
  end_time    TIME NOT NULL,              -- e.g. '20:00'
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_availability_teacher ON public.availability(teacher_id);

-- ─── AVAILABILITY EXCEPTIONS (one-off overrides) ─────────────
CREATE TABLE public.availability_exceptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES public.profiles(id),
  date        DATE NOT NULL,
  start_time  TIME,                       -- NULL = entire day blocked
  end_time    TIME,
  is_available BOOLEAN NOT NULL DEFAULT false, -- false = blocked, true = extra slot
  reason      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exceptions_date ON public.availability_exceptions(date);

-- ─── BOOKINGS ────────────────────────────────────────────────
CREATE TABLE public.bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name    TEXT NOT NULL,
  guest_email   TEXT NOT NULL,
  guest_level   student_level,
  guest_message TEXT DEFAULT '',
  date          DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,            -- default: start_time + 150 min
  status        booking_status NOT NULL DEFAULT 'pending',
  teacher_id    UUID NOT NULL REFERENCES public.profiles(id),
  decline_reason TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_date ON public.bookings(date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_teacher ON public.bookings(teacher_id);

-- ─── EMAIL LOGS ──────────────────────────────────────────────
CREATE TABLE public.email_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email    TEXT NOT NULL,
  subject     TEXT NOT NULL,
  template    TEXT NOT NULL,              -- e.g. 'homework_assigned'
  payload     JSONB DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'sent', -- sent | failed
  error       TEXT,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── BOOKING STATUS HISTORY ──────────────────────────────────
CREATE TABLE public.booking_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  old_status  booking_status,
  new_status  booking_status NOT NULL,
  changed_by  UUID REFERENCES public.profiles(id),
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_booking_history_booking ON public.booking_status_history(booking_id);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_homework_updated_at
  BEFORE UPDATE ON public.homework
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role user_role;
BEGIN
  -- Safely cast the role from metadata, default to 'student' on any error
  BEGIN
    _role := (NEW.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN OTHERS THEN
    _role := 'student';
  END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;

-- ─── UNIQUE CONSTRAINT: prevent double-booking same slot ─────
CREATE UNIQUE INDEX idx_bookings_unique_slot
  ON public.bookings(date, start_time)
  WHERE status IN ('pending', 'accepted');

-- ─── HELPER: check if current user is teacher ────────────────
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'teacher'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── PROFILES POLICIES ──────────────────────────────────────
-- Teachers can see all profiles
CREATE POLICY "Teachers can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_teacher());

-- Students can view their own profile
CREATE POLICY "Students can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Teachers can insert profiles (create students)
CREATE POLICY "Teachers can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_teacher());

-- Teachers can update any profile
CREATE POLICY "Teachers can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_teacher());

-- Students can update their own profile (limited)
CREATE POLICY "Students can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Teachers can delete profiles
CREATE POLICY "Teachers can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_teacher());

-- ─── LESSONS POLICIES ────────────────────────────────────────
-- Teachers: full access
CREATE POLICY "Teachers full access lessons"
  ON public.lessons FOR ALL
  USING (public.is_teacher());

-- Students: can read published lessons matching their level or all-levels
CREATE POLICY "Students can view published lessons"
  ON public.lessons FOR SELECT
  USING (
    published = true
    AND (
      target_level IS NULL
      OR target_level = (
        SELECT level FROM public.profiles WHERE id = auth.uid()
      )
    )
  );

-- ─── HOMEWORK POLICIES ──────────────────────────────────────
-- Teachers: full access
CREATE POLICY "Teachers full access homework"
  ON public.homework FOR ALL
  USING (public.is_teacher());

-- Students: can view homework assigned to them (by student, level, or all)
CREATE POLICY "Students can view assigned homework"
  ON public.homework FOR SELECT
  USING (
    target_student = auth.uid()
    OR (
      target_student IS NULL
      AND (
        target_level IS NULL
        OR target_level = (
          SELECT level FROM public.profiles WHERE id = auth.uid()
        )
      )
    )
  );

-- ─── SUBMISSIONS POLICIES ────────────────────────────────────
-- Teachers: full access
CREATE POLICY "Teachers full access submissions"
  ON public.submissions FOR ALL
  USING (public.is_teacher());

-- Students: can view own submissions
CREATE POLICY "Students can view own submissions"
  ON public.submissions FOR SELECT
  USING (student_id = auth.uid());

-- Students: can insert own submissions
CREATE POLICY "Students can insert submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Students: can update own submissions (re-submit)
CREATE POLICY "Students can update own submissions"
  ON public.submissions FOR UPDATE
  USING (student_id = auth.uid());

-- ─── AVAILABILITY POLICIES ──────────────────────────────────
-- Teachers: full access
CREATE POLICY "Teachers full access availability"
  ON public.availability FOR ALL
  USING (public.is_teacher());

-- Public read (for booking page) — anyone authenticated or anonymous
CREATE POLICY "Public can view active availability"
  ON public.availability FOR SELECT
  USING (is_active = true);

-- ─── AVAILABILITY EXCEPTIONS POLICIES ────────────────────────
CREATE POLICY "Teachers full access exceptions"
  ON public.availability_exceptions FOR ALL
  USING (public.is_teacher());

CREATE POLICY "Public can view exceptions"
  ON public.availability_exceptions FOR SELECT
  USING (true);

-- ─── BOOKINGS POLICIES ──────────────────────────────────────
-- Teachers: full access
CREATE POLICY "Teachers full access bookings"
  ON public.bookings FOR ALL
  USING (public.is_teacher());

-- Anyone can insert a booking (public page)
CREATE POLICY "Anyone can create booking"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Guest can view their own booking by email (handled via server-side, not RLS for anon)

-- ─── EMAIL LOGS POLICIES ─────────────────────────────────────
CREATE POLICY "Teachers full access email_logs"
  ON public.email_logs FOR ALL
  USING (public.is_teacher());

-- ─── BOOKING STATUS HISTORY POLICIES ─────────────────────────
CREATE POLICY "Teachers full access booking_history"
  ON public.booking_status_history FOR ALL
  USING (public.is_teacher());

-- =============================================================
-- STORAGE BUCKETS
-- =============================================================
-- Run these via Supabase Dashboard or API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);

-- Storage policies (documents bucket — teacher upload, student read)
-- CREATE POLICY "Teachers can upload documents"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'documents' AND public.is_teacher());

-- CREATE POLICY "Authenticated can read documents"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Storage policies (submissions bucket — student upload, teacher read)
-- CREATE POLICY "Students can upload submissions"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'submissions' AND auth.role() = 'authenticated');

-- CREATE POLICY "Teachers can read submissions"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'submissions' AND public.is_teacher());

-- CREATE POLICY "Students can read own submissions"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);
