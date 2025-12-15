import { Users, Building2, Briefcase } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1,234",
    label: "Étudiants",
    description: "Font confiance à CareerMatch",
  },
  {
    icon: Building2,
    value: "456",
    label: "Entreprises",
    description: "Partenaires actifs",
  },
  {
    icon: Briefcase,
    value: "789",
    label: "Opportunités",
    description: "Publiées ce mois",
  },
];

const Statistics = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-95" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Des chiffres qui parlent
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Une communauté grandissante de talents et d'entreprises innovantes.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-8 rounded-3xl glass-card hover:scale-105 transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 mb-6">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-5xl sm:text-6xl font-extrabold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-primary-foreground mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-primary-foreground/60">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
