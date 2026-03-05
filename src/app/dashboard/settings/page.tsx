import { createClient } from "@/lib/supabase/server";
import { Settings } from "lucide-react";
import { SettingsForms } from "./settings-forms";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Gérez votre profil et votre sécurité.
          </p>
        </div>
      </div>

      <SettingsForms
        fullName={profile?.full_name || ""}
        email={profile?.email || user?.email || ""}
      />
    </div>
  );
}
