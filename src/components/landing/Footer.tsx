import { Briefcase, Heart } from "lucide-react";

const footerLinks = [
  { name: "À propos", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Confidentialité", href: "#" },
  { name: "CGU", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">CareerMatch</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-8 mb-8">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-background/70 hover:text-background transition-colors duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-background/10 mb-8" />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-background/50">
            <span>© {new Date().getFullYear()} CareerMatch. Tous droits réservés.</span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1">
              Fait avec <Heart className="w-4 h-4 text-destructive fill-destructive" /> pour les étudiants
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
