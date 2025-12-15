import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Shield, Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bon retour ! 👋
            </h1>
            <p className="mt-2 text-muted-foreground">
              Connectez-vous pour accéder à vos opportunités
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex relative gradient-bg overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Retrouvez vos
                <span className="block text-white/90">opportunités</span>
              </h2>
              <p className="text-lg text-white/80 max-w-md">
                Accédez à votre tableau de bord personnalisé et découvrez les dernières recommandations adaptées à votre profil.
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass-card rounded-xl p-4 flex items-start gap-4 max-w-sm animate-fade-up">
                <div className="p-2 rounded-lg bg-white/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nouvelles recommandations</h3>
                  <p className="text-sm text-white/70">
                    Des offres mises à jour quotidiennement
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-start gap-4 max-w-sm animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="p-2 rounded-lg bg-white/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Données sécurisées</h3>
                  <p className="text-sm text-white/70">
                    Vos informations sont protégées
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-start gap-4 max-w-sm animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="p-2 rounded-lg bg-white/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Accès instantané</h3>
                  <p className="text-sm text-white/70">
                    Reprenez là où vous vous êtes arrêté
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default Login;
