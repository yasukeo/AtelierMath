import { createClient } from "@/lib/supabase/server";
import { Calendar } from "lucide-react";
import { AvailabilityForm } from "./availability-form";
import { ExceptionForm } from "./exception-form";
import { AvailabilityList } from "./availability-list";
import { ExceptionList } from "./exception-list";

export default async function AvailabilityPage() {
  const supabase = await createClient();

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .order("day")
    .order("start_time");

  const { data: exceptions } = await supabase
    .from("availability_exceptions")
    .select("*")
    .order("date", { ascending: true });

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-orange-50">
          <Calendar className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Disponibilités</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {(availability || []).length} créneau{(availability || []).length !== 1 ? "x" : ""} récurrent{(availability || []).length !== 1 ? "s" : ""}
            {" · "}{(exceptions || []).length} exception{(exceptions || []).length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recurring slots */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Créneaux récurrents</h2>
          <AvailabilityForm />
          <AvailabilityList slots={availability || []} />
        </div>

        {/* Exceptions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Exceptions</h2>
          <ExceptionForm />
          <ExceptionList exceptions={exceptions || []} />
        </div>
      </div>
    </div>
  );
}
