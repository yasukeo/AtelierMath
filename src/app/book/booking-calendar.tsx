"use client";

import { useState, useMemo } from "react";
import {
  addDays,
  format,
  startOfWeek,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import type { Availability, AvailabilityException, DayOfWeek } from "@/lib/types";
import { LEVELS, SESSION_DURATION_MINUTES } from "@/lib/types";
import { createBooking } from "./actions";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const dayIndexMap: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

interface Props {
  availability: Availability[];
  exceptions: AvailabilityException[];
  existingBookings: { date: string; start_time: string }[];
}

export function BookingCalendar({
  availability,
  exceptions,
  existingBookings,
}: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = startOfDay(new Date());
  const weekStart = addDays(
    startOfWeek(today, { weekStartsOn: 1 }),
    weekOffset * 7
  );

  // Generate slots for the week
  const weekSlots = useMemo(() => {
    const slots: { date: string; day: string; times: string[] }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayOfWeek = getDay(date);

      // Skip past dates
      if (isBefore(date, today)) {
        slots.push({
          date: dateStr,
          day: format(date, "EEEE d MMM", { locale: fr }),
          times: [],
        });
        continue;
      }

      // Check exceptions for this date
      const dateExceptions = exceptions.filter((e) => e.date === dateStr);
      const isBlockedFull = dateExceptions.some(
        (e) => !e.is_available && !e.start_time
      );

      if (isBlockedFull) {
        slots.push({
          date: dateStr,
          day: format(date, "EEEE d MMM", { locale: fr }),
          times: [],
        });
        continue;
      }

      // Get recurring slots for this day
      const dayName = Object.entries(dayIndexMap).find(
        ([, idx]) => idx === dayOfWeek
      )?.[0] as DayOfWeek;

      const recurringSlots = availability.filter((a) => a.day === dayName);

      // Generate time slots (every SESSION_DURATION_MINUTES minutes)
      const times: string[] = [];

      for (const slot of recurringSlots) {
        const [sh, sm] = slot.start_time.split(":").map(Number);
        const [eh, em] = slot.end_time.split(":").map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        for (
          let t = startMin;
          t + SESSION_DURATION_MINUTES <= endMin;
          t += SESSION_DURATION_MINUTES
        ) {
          const hh = Math.floor(t / 60)
            .toString()
            .padStart(2, "0");
          const mm = (t % 60).toString().padStart(2, "0");
          const timeStr = `${hh}:${mm}`;

          // Check if not blocked by exception
          const isBlocked = dateExceptions.some(
            (e) =>
              !e.is_available &&
              e.start_time &&
              e.start_time <= timeStr &&
              e.end_time! > timeStr
          );

          // Check if not already booked
          const isBooked = existingBookings.some(
            (b) => b.date === dateStr && b.start_time.slice(0, 5) === timeStr
          );

          if (!isBlocked && !isBooked) {
            times.push(timeStr);
          }
        }
      }

      // Add extra slots from exceptions
      const extraSlots = dateExceptions.filter((e) => e.is_available);
      for (const extra of extraSlots) {
        if (extra.start_time && extra.end_time) {
          const [sh, sm] = extra.start_time.split(":").map(Number);
          const [eh, em] = extra.end_time.split(":").map(Number);
          const startMin = sh * 60 + sm;
          const endMin = eh * 60 + em;

          for (
            let t = startMin;
            t + SESSION_DURATION_MINUTES <= endMin;
            t += SESSION_DURATION_MINUTES
          ) {
            const hh = Math.floor(t / 60)
              .toString()
              .padStart(2, "0");
            const mm = (t % 60).toString().padStart(2, "0");
            const timeStr = `${hh}:${mm}`;

            const isBooked = existingBookings.some(
              (b) => b.date === dateStr && b.start_time.slice(0, 5) === timeStr
            );

            if (!isBooked && !times.includes(timeStr)) {
              times.push(timeStr);
            }
          }
        }
      }

      times.sort();

      slots.push({
        date: dateStr,
        day: format(date, "EEEE d MMM", { locale: fr }),
        times,
      });
    }

    return slots;
  }, [weekOffset, availability, exceptions, existingBookings]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("date", selectedSlot.date);
    formData.set("start_time", selectedSlot.time);

    const result = await createBooking(formData);

    if (!result.success) {
      setError(result.error || "Erreur inconnue");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-green-800 mb-2">
          Demande envoyée !
        </h2>
        <p className="text-green-700">
          Votre demande de réservation a bien été envoyée. Vous recevrez un
          email de confirmation une fois que la professeure aura accepté votre
          créneau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
          disabled={weekOffset === 0}
          className="p-2.5 rounded-xl hover:bg-gray-100 transition disabled:opacity-30 border border-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-semibold text-gray-800">
          Semaine du{" "}
          {format(weekStart, "d MMMM yyyy", { locale: fr })}
        </span>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset >= 8}
          className="p-2.5 rounded-xl hover:bg-gray-100 transition disabled:opacity-30 border border-gray-200"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm shadow-gray-200/50">
        {weekSlots.map((dayData) => (
          <div key={dayData.date} className="min-h-[120px]">
            <div className="text-xs font-medium text-gray-500 text-center mb-2 capitalize">
              {dayData.day}
            </div>
            <div className="space-y-1">
              {dayData.times.length === 0 ? (
                <div className="text-xs text-gray-300 text-center py-4">—</div>
              ) : (
                dayData.times.map((time) => {
                  const isSelected =
                    selectedSlot?.date === dayData.date &&
                    selectedSlot?.time === time;
                  return (
                    <button
                      key={time}
                      onClick={() =>
                        setSelectedSlot({ date: dayData.date, time })
                      }
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking form */}
      {selectedSlot && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm shadow-gray-200/50"
        >
          <h2 className="text-lg font-semibold">
            Réserver le{" "}
            {format(new Date(selectedSlot.date + "T00:00:00"), "EEEE d MMMM yyyy", {
              locale: fr,
            })}{" "}
            à {selectedSlot.time}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                name="guest_name"
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                name="guest_email"
                type="email"
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau
              </label>
              <select
                name="guest_level"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Non précisé</option>
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optionnel)
            </label>
            <textarea
              name="guest_message"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Précisez le sujet, chapitre, ou toute information utile..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
          >
            {loading
              ? "Envoi en cours..."
              : "Envoyer la demande de réservation"}
          </button>
        </form>
      )}
    </div>
  );
}
