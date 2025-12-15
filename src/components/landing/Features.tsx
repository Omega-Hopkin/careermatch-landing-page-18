import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileCheck, Activity } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Recommandations Intelligentes",
    description: "Notre IA analyse ton profil et tes préférences pour te proposer les opportunités les plus pertinentes.",
  },
  {
    icon: FileCheck,
    title: "Candidatures Simplifiées",
    description: "Postule en quelques clics grâce à notre système de candidature automatisé et personnalisé.",
  },
  {
    icon: Activity,
    title: "Suivi en Temps Réel",
    description: "Suis l'avancement de tes candidatures et reçois des notifications instantanées.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Tout ce dont tu as besoin pour{" "}
            <span className="gradient-text">réussir</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète conçue pour simplifier ta recherche de stage ou d'emploi.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 gradient-bg opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
