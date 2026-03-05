"use client";

import { useState } from "react";
import { updateProfile, updatePassword } from "./actions";
import { Check, AlertCircle } from "lucide-react";

interface Props {
  fullName: string;
  email: string;
}

export function SettingsForms({ fullName, email }: Props) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setProfileLoading(false);
    if (result.success) {
      setProfileMsg({ type: "success", text: "Profil mis à jour avec succès !" });
    } else {
      setProfileMsg({ type: "error", text: result.error || "Erreur inconnue" });
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    setPasswordLoading(false);
    if (result.success) {
      setPasswordMsg({ type: "success", text: "Mot de passe modifié avec succès !" });
      e.currentTarget.reset();
    } else {
      setPasswordMsg({ type: "error", text: result.error || "Erreur inconnue" });
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile section */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold">Informations personnelles</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Modifiez vos informations de profil.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {profileMsg && (
            <div
              className={`flex items-center gap-2 text-sm rounded-xl p-3 ${
                profileMsg.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {profileMsg.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {profileMsg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nom complet
            </label>
            <input
              name="full_name"
              required
              defaultValue={fullName}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              disabled
              value={email}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              L&apos;email ne peut pas être modifié.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
            >
              {profileLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>

      {/* Password section */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold">Sécurité</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Changez votre mot de passe.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {passwordMsg && (
            <div
              className={`flex items-center gap-2 text-sm rounded-xl p-3 ${
                passwordMsg.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {passwordMsg.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {passwordMsg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              name="new_password"
              type="password"
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Min. 6 caractères"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              name="confirm_password"
              type="password"
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Retapez le nouveau mot de passe"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
            >
              {passwordLoading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
