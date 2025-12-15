import { GraduationCap, Briefcase, Target, CheckCircle } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";

const benefits = [
  {
    icon: Target,
    title: "Recommandations personnalisées",
    description: "L'IA analyse votre profil pour vous proposer les meilleures opportunités",
  },
  {
    icon: Briefcase,
    title: "Accès exclusif",
    description: "Des offres de stages et d'emplois réservées à notre communauté",
  },
  {
    icon: CheckCircle,
    title: "Candidature simplifiée",
    description: "Postulez en un clic avec votre profil pré-rempli",
  },
];

const Register = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">CareerMatch</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Créer un compte</h1>
            <p className="text-muted-foreground">
              Rejoignez CareerMatch et trouvez votre opportunité idéale
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>

      {/* Right Side - Illustration & Benefits */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg text-white space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              Lancez votre carrière dès aujourd'hui
            </h2>
            <p className="text-lg text-white/80">
              Rejoignez des milliers d'étudiants qui ont trouvé leur stage ou emploi grâce à CareerMatch.
            </p>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 items-start glass-card p-4 rounded-xl animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 bg-white/20 rounded-lg shrink-0">
                  <benefit.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-white/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/80">
              <span className="font-bold">+1,234</span> étudiants nous font confiance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
