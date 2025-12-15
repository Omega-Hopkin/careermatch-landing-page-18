import { Button } from "@/components/ui/button";
import { Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="container mx-auto">
        <div className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CareerMatch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
              Entreprises
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
              À propos
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link to="/register">S'inscrire</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 glass-card rounded-2xl p-4 animate-fade-up">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start text-foreground/70">
                Entreprises
              </Button>
              <Button variant="ghost" className="w-full justify-start text-foreground/70">
                À propos
              </Button>
              <div className="h-px bg-border my-2" />
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button variant="gradient" className="w-full" asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
