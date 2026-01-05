import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Share2,
  Flag,
  Building2,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MatchScoreCard } from '@/components/job-detail/MatchScoreCard';
import { CompanySidebar } from '@/components/job-detail/CompanySidebar';
import { RequirementsCard } from '@/components/job-detail/RequirementsCard';
import { JobDescriptionSection } from '@/components/job-detail/JobDescriptionSection';
import { SimilarJobs } from '@/components/job-detail/SimilarJobs';
import { ApplicationModal } from '@/components/job-detail/ApplicationModal';

// Mock job data
const mockJob = {
  id: '1',
  title: 'Développeur Full Stack React/Node.js',
  company: {
    name: 'TechStart SAS',
    description: 'TechStart est une startup innovante spécialisée dans le développement de solutions SaaS pour les entreprises. Nous accompagnons nos clients dans leur transformation digitale.',
    size: '50-100 employés',
    industry: 'Technologie / SaaS',
    website: 'https://techstart.example.com',
    openPositions: 5,
  },
  location: 'Paris, France',
  isRemote: true,
  matchScore: 92,
  matchingSkills: ['React', 'TypeScript', 'Node.js', 'Git'],
  missingSkills: ['AWS', 'Docker'],
  postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  description: `Nous recherchons un(e) développeur(se) Full Stack passionné(e) pour rejoindre notre équipe technique en pleine croissance.

Vous travaillerez sur notre plateforme SaaS utilisée par des milliers d'entreprises à travers la France. Vous aurez l'opportunité de contribuer à des projets innovants et d'avoir un impact direct sur le produit.

Notre stack technique moderne vous permettra de développer vos compétences tout en travaillant sur des problématiques techniques stimulantes.`,
  missions: [
    'Développer de nouvelles fonctionnalités frontend et backend',
    'Participer aux code reviews et améliorer la qualité du code',
    'Collaborer avec l\'équipe produit pour définir les spécifications',
    'Maintenir et optimiser les applications existantes',
    'Contribuer à l\'amélioration continue de nos pratiques de développement',
  ],
  profile: [
    'Formation Bac+5 en informatique ou équivalent',
    'Expérience confirmée avec React et Node.js',
    'Maîtrise de TypeScript et des bonnes pratiques de développement',
    'Capacité à travailler en équipe et bonne communication',
    'Curiosité technique et envie d\'apprendre',
  ],
  benefits: [
    'Télétravail flexible',
    'Mutuelle premium',
    'RTT généreux',
    'Tickets restaurant',
    'Formation continue',
    'Équipement au choix',
    'Événements d\'équipe',
    'Stock options',
  ],
  requirements: {
    education: 'Bac+5 en informatique',
    experience: '2-3 ans d\'expérience',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Git'],
    languages: ['Français (natif)', 'Anglais (professionnel)'],
    contractType: 'CDI',
  },
  status: 'active' as const,
  hasApplied: false,
};

const similarJobs = [
  {
    id: '2',
    title: 'Développeur Frontend React',
    company: 'WebAgency',
    location: 'Lyon',
    isRemote: true,
    matchScore: 85,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Ingénieur Full Stack JavaScript',
    company: 'CloudTech',
    location: 'Paris',
    isRemote: false,
    matchScore: 78,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Lead Developer Node.js',
    company: 'StartupXYZ',
    location: 'Bordeaux',
    isRemote: true,
    matchScore: 72,
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(mockJob.hasApplied);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Offre retirée des favoris' : 'Offre sauvegardée!',
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Lien copié!' });
    } catch {
      toast({ title: 'Impossible de copier le lien', variant: 'destructive' });
    }
  };

  const handleReport = () => {
    toast({ title: 'Signalement envoyé', description: 'Nous examinerons cette offre.' });
  };

  const handleApplication = (data: { coverLetter: string; cvSource: 'profile' | 'upload'; cvFile?: File }) => {
    console.log('Application submitted:', data);
    setHasApplied(true);
  };

  const isExpired = new Date(mockJob.expiresAt) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <DashboardSidebar />

        <SidebarInset className="flex-1 overflow-auto">
          <header className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
            <SidebarTrigger />
          </header>

          <main className="flex-1">
            <div className="max-w-6xl mx-auto p-6 lg:p-8 pb-24 lg:pb-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link to="/jobs" className="hover:text-foreground transition-colors">
                  Recherche
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{mockJob.title}</span>
              </nav>

              {/* Back Button */}
              <Button
                variant="ghost"
                className="mb-6 gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>

              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                        {mockJob.title}
                      </h1>
                      <Link
                        to={`/companies/${encodeURIComponent(mockJob.company.name)}`}
                        className="text-lg text-primary hover:underline"
                      >
                        {mockJob.company.name}
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{mockJob.location}</span>
                    </div>
                    {mockJob.isRemote && (
                      <Badge variant="secondary">Remote possible</Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatRelativeDate(mockJob.postedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={isSaved ? 'text-red-500 hover:text-red-600' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Flag className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleReport}>
                        Signaler cette offre
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {hasApplied ? (
                    <Button variant="secondary" disabled className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Candidature envoyée
                    </Button>
                  ) : isExpired ? (
                    <Button disabled>Offre expirée</Button>
                  ) : (
                    <Button onClick={() => setIsApplicationModalOpen(true)}>
                      Postuler maintenant
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Match Score Card - Mobile */}
                  <div className="lg:hidden">
                    <MatchScoreCard
                      score={mockJob.matchScore}
                      matchingSkills={mockJob.matchingSkills}
                      missingSkills={mockJob.missingSkills}
                      explanation="Votre profil correspond particulièrement bien à cette offre grâce à vos compétences en React et Node.js. Pour améliorer votre score, développez vos connaissances en AWS et Docker."
                    />
                  </div>

                  {/* Job Description */}
                  <JobDescriptionSection
                    description={mockJob.description}
                    missions={mockJob.missions}
                    profile={mockJob.profile}
                    benefits={mockJob.benefits}
                  />

                  {/* Requirements Card */}
                  <RequirementsCard requirements={mockJob.requirements} />

                  {/* Similar Jobs */}
                  <SimilarJobs
                    jobs={similarJobs}
                    onJobClick={(jobId) => navigate(`/jobs/${jobId}`)}
                  />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Match Score Card - Desktop */}
                  <div className="hidden lg:block">
                    <MatchScoreCard
                      score={mockJob.matchScore}
                      matchingSkills={mockJob.matchingSkills}
                      missingSkills={mockJob.missingSkills}
                      explanation="Votre profil correspond particulièrement bien à cette offre grâce à vos compétences en React et Node.js. Pour améliorer votre score, développez vos connaissances en AWS et Docker."
                    />
                  </div>

                  {/* Company Sidebar */}
                  <CompanySidebar company={mockJob.company} />
                </div>
              </div>
            </div>

            {/* Mobile Sticky CTA */}
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-50">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={isSaved ? 'text-red-500 hover:text-red-600' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  {hasApplied ? (
                    <Button variant="secondary" disabled className="flex-1 gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Candidature envoyée
                    </Button>
                  ) : isExpired ? (
                    <Button disabled className="flex-1">
                      Offre expirée
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => setIsApplicationModalOpen(true)}
                    >
                      Postuler maintenant
                    </Button>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Application Modal */}
          <ApplicationModal
            open={isApplicationModalOpen}
            onOpenChange={setIsApplicationModalOpen}
            jobTitle={mockJob.title}
            companyName={mockJob.company.name}
            onSubmit={handleApplication}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default JobDetail;
