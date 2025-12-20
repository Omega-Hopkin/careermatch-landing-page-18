import { Building2, Users, Globe, ExternalLink, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CompanyInfo {
  name: string;
  description: string;
  size: string;
  industry: string;
  website?: string;
  logoUrl?: string;
  openPositions?: number;
}

interface CompanySidebarProps {
  company: CompanyInfo;
}

export const CompanySidebar = ({ company }: CompanySidebarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          À propos de l'entreprise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Logo */}
        <div className="flex items-center gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{company.description}</p>

        <Separator />

        {/* Company Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Taille:</span>
            <span className="font-medium">{company.size}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Secteur:</span>
            <span className="font-medium">{company.industry}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Site web
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/companies/${encodeURIComponent(company.name)}`}>
              <Briefcase className="h-4 w-4 mr-2" />
              Voir toutes les offres ({company.openPositions || 0})
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
