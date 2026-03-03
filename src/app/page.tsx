import Link from "next/link";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  CheckCircle,
  Users,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Leçons interactives",
      description:
        "Accédez à vos cours de maths en ligne, organisés par niveau.",
    },
    {
      icon: ClipboardList,
      title: "Devoirs & suivi",
      description:
        "Recevez vos devoirs, soumettez vos réponses et obtenez des corrections personnalisées.",
    },
    {
      icon: Calendar,
      title: "Réservation en ligne",
      description:
        "Réservez vos séances de soutien directement depuis le calendrier.",
    },
    {
      icon: Users,
      title: "Suivi personnalisé",
      description:
        "Un accompagnement adapté à votre niveau et vos objectifs.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 rounded-xl p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              AtelierMath
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/book"
              className="hidden sm:inline-flex text-sm text-gray-600 hover:text-blue-600 font-medium px-3 py-2"
            >
              Réserver
            </Link>
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
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <CheckCircle className="h-4 w-4" />
              Cours de soutien pour lycéens
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Progressez en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                mathématiques
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Accompagnement personnalisé pour les lycéens. Leçons, devoirs
              corrigés et suivi de progression en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 text-base font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
              >
                <Calendar className="h-5 w-5" />
                Réserver une séance
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 text-base font-semibold"
              >
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tout pour réussir en maths
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Une plateforme complète pour accompagner vos révisions et votre
              progression.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-gray-50 hover:bg-white rounded-2xl p-6 border border-transparent hover:border-gray-200 hover:shadow-lg"
              >
                <div className="bg-blue-100 text-blue-600 rounded-xl p-3 w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl px-8 sm:px-14 py-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Prêt à progresser ?
              </h2>
              <p className="text-blue-100 mb-8 max-w-md mx-auto">
                Rejoignez AtelierMath et commencez votre accompagnement
                personnalisé dès aujourd&apos;hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3.5 rounded-xl hover:bg-blue-50 font-semibold shadow-lg"
                >
                  <Calendar className="h-5 w-5" />
                  Réserver une séance
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 text-white border border-white/25 px-6 py-3.5 rounded-xl hover:bg-white/25 font-semibold"
                >
                  S&apos;inscrire gratuitement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              AtelierMath
            </span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AtelierMath — Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}
