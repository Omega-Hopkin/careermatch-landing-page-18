import { GraduationCap, Clock, Code, Languages, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Requirements {
  education?: string;
  experience?: string;
  skills: string[];
  languages?: string[];
  contractType: string;
  duration?: string;
}

interface RequirementsCardProps {
  requirements: Requirements;
}

export const RequirementsCard = ({ requirements }: RequirementsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prérequis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Type */}
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Type de contrat</p>
            <Badge variant="secondary" className="mt-1">
              {requirements.contractType}
            </Badge>
            {requirements.duration && (
              <span className="text-sm text-muted-foreground ml-2">
                ({requirements.duration})
              </span>
            )}
          </div>
        </div>

        {/* Education */}
        {requirements.education && (
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Formation</p>
              <p className="font-medium">{requirements.education}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {requirements.experience && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Expérience</p>
              <p className="font-medium">{requirements.experience}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="flex items-start gap-3">
          <Code className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Compétences requises</p>
            <div className="flex flex-wrap gap-2">
              {requirements.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Languages */}
        {requirements.languages && requirements.languages.length > 0 && (
          <div className="flex items-start gap-3">
            <Languages className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Langues</p>
              <div className="flex flex-wrap gap-2">
                {requirements.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
