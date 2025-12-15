import { UserPlus, Lightbulb, MousePointerClick } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Créer ton profil",
    description: "Renseigne tes compétences, tes expériences et tes aspirations en quelques minutes.",
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Reçois des recommandations",
    description: "Notre IA analyse ton profil et te propose les opportunités qui te correspondent le mieux.",
  },
  {
    icon: MousePointerClick,
    step: "03",
    title: "Postule en un clic",
    description: "Envoie ta candidature instantanément et suis son avancement en temps réel.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/50 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Comment ça marche</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Trois étapes vers ton{" "}
            <span className="gradient-text">avenir</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et efficace pour te connecter aux meilleures opportunités.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />
            
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Step Card */}
                <div className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border">
                  {/* Step Number */}
                  <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
                      <item.icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    {/* Step Badge */}
                    <div className="absolute -top-2 -right-2 md:right-auto md:-left-2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{item.step}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-center">{item.title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">{item.description}</p>
                </div>

                {/* Mobile Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 gradient-bg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
