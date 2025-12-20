import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface JobDescriptionSectionProps {
  description: string;
  missions: string[];
  profile: string[];
  benefits: string[];
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section = ({ title, children, defaultOpen = true }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 border-b border-border group">
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 pb-6 animate-fade-in">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const JobDescriptionSection = ({
  description,
  missions,
  profile,
  benefits,
}: JobDescriptionSectionProps) => {
  return (
    <div className="space-y-2">
      {/* Description */}
      <Section title="Description du poste" defaultOpen={true}>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="whitespace-pre-line">{description}</p>
        </div>
      </Section>

      {/* Missions */}
      <Section title="Missions" defaultOpen={true}>
        <ul className="space-y-2">
          {missions.map((mission, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{mission}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Profile */}
      <Section title="Profil recherché" defaultOpen={true}>
        <ul className="space-y-2">
          {profile.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Benefits */}
      <Section title="Avantages" defaultOpen={false}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-muted-foreground bg-accent/50 rounded-lg px-3 py-2"
            >
              <span className="text-lg">✨</span>
              {benefit}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};
