import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, ArrowRight, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export interface RecruiterApplication {
  id: string;
  studentName: string;
  studentAvatar?: string;
  jobTitle: string;
  matchScore: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
}

interface RecentApplicationsRecruiterProps {
  applications: RecruiterApplication[];
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

const getMatchScoreColor = (score: number) => {
  if (score >= 75) return "text-green-600 bg-green-100";
  if (score >= 50) return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
};

export const RecentApplicationsRecruiter = ({
  applications,
  onAccept,
  onReject,
}: RecentApplicationsRecruiterProps) => {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucune candidature</h3>
          <p className="text-sm text-muted-foreground text-center">
            Les candidatures apparaîtront ici une fois reçues.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Candidatures récentes</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-primary"
          onClick={() => navigate('/recruiter/applications')}
        >
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={application.studentAvatar} alt={application.studentName} />
              <AvatarFallback>
                {application.studentName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {application.studentName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {application.jobTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true, locale: fr })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`${getMatchScoreColor(application.matchScore)} border-0`}>
                {application.matchScore}%
              </Badge>
              
              {application.status === 'pending' && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                    onClick={() => onAccept(application.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                    onClick={() => onReject(application.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
