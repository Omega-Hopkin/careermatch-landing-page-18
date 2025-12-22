import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Clock, Briefcase, GraduationCap, Wifi } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JobPreviewCardProps {
  data: {
    title: string;
    jobType: string;
    location: string;
    remote: boolean;
    description: string;
    skills: string[];
    educationLevel: string;
    experienceRequired: string;
    expirationDate?: Date;
    duration?: string;
  };
  companyName?: string;
}

const jobTypeLabels: Record<string, string> = {
  stage: 'Stage',
  cdi: 'CDI',
  cdd: 'CDD',
  freelance: 'Freelance',
  alternance: 'Alternance',
};

const educationLabels: Record<string, string> = {
  bac: 'Bac',
  'bac+2': 'Bac+2',
  'bac+3': 'Bac+3 (Licence)',
  'bac+5': 'Bac+5 (Master)',
  'bac+8': 'Bac+8 (Doctorat)',
};

export function JobPreviewCard({ data, companyName = "Votre Entreprise" }: JobPreviewCardProps) {
  return (
    <Card className="border-2 border-dashed border-muted-foreground/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {data.title || "Titre du poste"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{companyName}</p>
            </div>
          </div>
          <Badge variant="secondary">
            {jobTypeLabels[data.jobType] || 'Type'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {data.location || "Localisation"}
          </div>
          {data.remote && (
            <div className="flex items-center gap-1 text-primary">
              <Wifi className="h-4 w-4" />
              Télétravail possible
            </div>
          )}
          {data.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {data.duration}
            </div>
          )}
        </div>

        {data.description && (
          <div 
            className="text-sm text-muted-foreground line-clamp-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        )}

        <div className="flex flex-wrap gap-2">
          {data.skills.slice(0, 5).map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {data.skills.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{data.skills.length - 5}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
          {data.educationLevel && (
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              {educationLabels[data.educationLevel] || data.educationLevel}
            </div>
          )}
          {data.experienceRequired && (
            <div className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {data.experienceRequired}
            </div>
          )}
          {data.expirationDate && (
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="h-3.5 w-3.5" />
              Expire le {format(data.expirationDate, 'dd MMM yyyy', { locale: fr })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
