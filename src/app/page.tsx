import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  CheckCircle,
  Users,
  User,
  Monitor,
  MapPin,
  FileCheck,
  Languages,
  ArrowRight,
  Mail,
  Phone,
  Tag,
  Gift,
  Percent,
  Lock,
  ClipboardList,
} from "lucide-react";

export default async function HomePage() {
  /* ── Auth check: show gated sections only to logged-in students ── */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isStudent = false;
  let isTeacher = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isStudent = profile?.role === "student";
    isTeacher = profile?.role === "teacher";
  }

  const isLoggedIn = !!user;

  /* ── Services list ── */
  const services = [
    { icon: User, label: "Cours individuels" },
    { icon: Users, label: "Cours en groupe de 2" },
    { icon: Users, label: "Cours en groupe de 4" },
    { icon: Monitor, label: "Cours en ligne" },
    { icon: MapPin, label: "Cours en présentiel" },
    { icon: FileCheck, label: "Correction et explication de séries" },
    { icon: Languages, label: "Cours en français ou en arabe" },
  ];

  /* ── Pricing plans ── */
  const plans = [
    {
      name: "Individuel",
      price: "200 DH",
      per: "/ séance",
      features: [
        "Cours personnalisé 1-on-1",
        "Durée : 2h30",
        "Correction de séries incluse",
        "Suivi en ligne",
      ],
      highlight: false,
    },
    {
      name: "Groupe de 2",
      price: "150 DH",
      per: "/ élève / séance",
      features: [
        "Cours en duo",
        "Durée : 2h30",
        "Correction de séries incluse",
        "Tarif réduit",
      ],
      highlight: true,
    },
    {
      name: "Groupe de 4",
      price: "100 DH",
      per: "/ élève / séance",
      features: [
        "Petit groupe interactif",
        "Durée : 2h30",
        "Correction de séries incluse",
        "Meilleur rapport qualité-prix",
      ],
      highlight: false,
    },
  ];

  const pricingPerks = [
    {
      icon: Gift,
      title: "Cours d\u2019essai",
      desc: "Première séance découverte à tarif réduit.",
    },
    {
      icon: Tag,
      title: "Packs de séances",
      desc: "Réservez 4 séances et bénéficiez d\u2019une réduction de 10\u00A0%.",
    },
    {
      icon: Percent,
      title: "Réduction groupe",
      desc: "Tarifs dégressifs pour les groupes de 2 ou 4 élèves.",
    },
  ];

  /* ── Nav items (anchor links) ── */
  const publicNav = [
    { href: "#accueil", label: "Accueil" },
    { href: "#a-propos", label: "À propos" },
    { href: "#services", label: "Services" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#reservation", label: "Réservation" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#accueil" className="flex items-center gap-2.5">
            <div className="bg-blue-600 rounded-xl p-2">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              AtelierMath
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicNav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50/60 transition"
              >
                {n.label}
              </a>
            ))}
            {/* Gated links */}
            {isStudent && (
              <>
                <Link
                  href="/student/lessons"
                  className="text-sm text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50/60 transition"
                >
                  Ressources
                </Link>
                <Link
                  href="/student/homework"
                  className="text-sm text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50/60 transition"
                >
                  Correction
                </Link>
              </>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href={isTeacher ? "/dashboard" : "/student"}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
              >
                Mon espace
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium px-3 py-2"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════ 1. ACCUEIL (Hero) ═══════════════ */}
      <section id="accueil" className="relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <CheckCircle className="h-4 w-4" />
              Cours de soutien en mathématiques
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Progressez en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                mathématiques
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Accompagnement personnalisé pour lycéens — cours individuels ou en
              groupe, en ligne ou en présentiel, en français ou en arabe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#reservation"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 text-base font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
              >
                <Calendar className="h-5 w-5" />
                Réserver une séance
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-base font-semibold transition-all"
              >
                Découvrir nos services
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. À PROPOS ═══════════════ */}
      <section id="a-propos" className="py-20 sm:py-28 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              À propos d&apos;AtelierMath
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              AtelierMath est une plateforme de soutien scolaire en
              mathématiques dédiée aux lycéens. Notre mission est de rendre les
              maths accessibles et compréhensibles grâce à un accompagnement
              structuré et bienveillant.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Que vous soyez en 2nde, 1ère ou Terminale, nous proposons des
              cours adaptés à votre niveau — en individuel ou en petit groupe, en
              ligne ou en présentiel, en français ou en arabe.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {[
                {
                  value: "100+",
                  label: "Élèves accompagnés",
                },
                {
                  value: "5+",
                  label: "Années d\u2019expérience",
                },
                {
                  value: "98%",
                  label: "Taux de satisfaction",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. SERVICES ═══════════════ */}
      <section
        id="services"
        className="py-20 sm:py-28 bg-gray-50 scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nos services
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Des formules flexibles pour s&apos;adapter à vos besoins et votre
              emploi du temps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {services.map((s, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="bg-blue-100 text-blue-600 rounded-xl p-3 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-800">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. TARIFS ═══════════════ */}
      <section id="tarifs" className="py-20 sm:py-28 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tarifs
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Des prix transparents, adaptés à chaque formule.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border transition-all ${
                  plan.highlight
                    ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20 scale-[1.03]"
                    : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-lg"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <h3
                  className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span
                    className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-blue-600"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}
                  >
                    {plan.per}
                  </span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlight ? "text-blue-200" : "text-green-500"}`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-blue-100" : "text-gray-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#reservation"
                  className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Réserver
                </a>
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {pricingPerks.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="bg-blue-100 text-blue-600 rounded-lg p-2 shrink-0">
                  <p.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {p.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. RÉSERVATION ═══════════════ */}
      <section
        id="reservation"
        className="py-20 sm:py-28 bg-gray-50 scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Réservation
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-10">
            Choisissez un créneau disponible et envoyez votre demande. Vous
            recevrez une confirmation par email.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 text-base font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all"
          >
            <Calendar className="h-5 w-5" />
            Voir le calendrier &amp; réserver
          </Link>
        </div>
      </section>

      {/* ═══════════════ 6. RESSOURCES (étudiants uniquement) ═══════════════ */}
      <section
        id="ressources"
        className="py-20 sm:py-28 bg-white scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ressources
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Leçons, cours et supports pédagogiques pour accompagner votre
              progression.
            </p>
          </div>

          {isStudent ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-lg mx-auto">
                <BookOpen className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <p className="text-green-800 font-medium mb-4">
                  Vous avez accès à toutes les ressources.
                </p>
                <Link
                  href="/student/lessons"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-semibold transition"
                >
                  <BookOpen className="h-4 w-4" />
                  Accéder aux leçons
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-lg mx-auto">
                <Lock className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  Contenu réservé aux élèves inscrits.
                </p>
                <p className="text-gray-500 text-sm mb-5">
                  Connectez-vous ou inscrivez-vous pour accéder aux leçons et
                  supports de cours.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-medium text-sm transition"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 font-medium text-sm transition"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ 7. CORRECTION DE SÉRIES (étudiants uniquement) ═══════════════ */}
      <section
        id="correction"
        className="py-20 sm:py-28 bg-gray-50 scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Correction de séries
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Soumettez vos séries d&apos;exercices et recevez des corrections
              détaillées avec explications.
            </p>
          </div>

          {isStudent ? (
            <div className="text-center">
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-8 max-w-lg mx-auto">
                <ClipboardList className="h-10 w-10 text-violet-600 mx-auto mb-4" />
                <p className="text-violet-800 font-medium mb-4">
                  Accédez à vos devoirs et soumettez vos corrections.
                </p>
                <Link
                  href="/student/homework"
                  className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 font-semibold transition"
                >
                  <ClipboardList className="h-4 w-4" />
                  Mes devoirs &amp; corrections
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-lg mx-auto">
                <Lock className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  Contenu réservé aux élèves inscrits.
                </p>
                <p className="text-gray-500 text-sm mb-5">
                  Inscrivez-vous pour soumettre vos séries et recevoir des
                  corrections personnalisées.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-medium text-sm transition"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 font-medium text-sm transition"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ 8. CONTACT ═══════════════ */}
      <section id="contact" className="py-20 sm:py-28 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Une question ? N&apos;hésitez pas à nous contacter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact info */}
            <div className="space-y-5">
              <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="bg-blue-100 text-blue-600 rounded-xl p-3 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a
                    href="mailto:contact@ateliermath.ma"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    contact@ateliermath.ma
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="bg-blue-100 text-blue-600 rounded-xl p-3 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Téléphone</p>
                  <a
                    href="tel:+212600000000"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    +212 6 00 00 00 00
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="bg-blue-100 text-blue-600 rounded-xl p-3 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Adresse</p>
                  <p className="text-gray-500 text-sm">
                    Casablanca, Maroc
                  </p>
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-3">
                  Prêt à progresser ?
                </h3>
                <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                  Rejoignez AtelierMath et commencez votre accompagnement
                  personnalisé dès aujourd&apos;hui.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-50 font-semibold text-sm transition"
                  >
                    <Calendar className="h-4 w-4" />
                    Réserver une séance
                  </Link>
                  {!isLoggedIn && (
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 bg-white/15 text-white border border-white/25 px-5 py-3 rounded-xl hover:bg-white/25 font-semibold text-sm transition"
                    >
                      S&apos;inscrire gratuitement
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-lg p-1.5">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                AtelierMath
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#a-propos" className="hover:text-blue-600 transition">
                À propos
              </a>
              <a href="#services" className="hover:text-blue-600 transition">
                Services
              </a>
              <a href="#tarifs" className="hover:text-blue-600 transition">
                Tarifs
              </a>
              <a href="#contact" className="hover:text-blue-600 transition">
                Contact
              </a>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AtelierMath — Tous droits
              réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
