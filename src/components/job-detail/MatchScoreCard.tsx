import { Check, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MatchScoreCardProps {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  explanation?: string;
}

export const MatchScoreCard = ({
  score,
  matchingSkills,
  missingSkills,
  explanation = "Ce score est basé sur la correspondance entre vos compétences et les exigences du poste."
}: MatchScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Score de compatibilité</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{explanation}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.51} 251`}
                className={getScoreColor(score)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {score >= 75 && "Excellent match!"}
            {score >= 50 && score < 75 && "Bon potentiel"}
            {score < 50 && "Match partiel"}
          </p>
        </div>

        {/* Matching Skills */}
        {matchingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Compétences correspondantes
            </h4>
            <div className="space-y-1">
              {matchingSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Compétences à développer
            </h4>
            <div className="space-y-1">
              {missingSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why this match */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Pourquoi ce match ?</h4>
          <p className="text-sm text-muted-foreground">{explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
};
