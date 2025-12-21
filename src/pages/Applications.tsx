import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, FileText, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ApplicationCard, Application, ApplicationStatus } from '@/components/applications/ApplicationCard';
import { ApplicationsEmptyState } from '@/components/applications/ApplicationsEmptyState';
import { ApplicationCardSkeleton } from '@/components/applications/ApplicationCardSkeleton';
import { WithdrawDialog } from '@/components/applications/WithdrawDialog';

// Mock data - replace with real API calls
const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Développeur Full-Stack',
    companyName: 'TechCorp',
    companyLogo: '',
    location: 'Paris',
    appliedAt: '2024-12-15T10:30:00Z',
    status: 'reviewed',
    lastUpdatedAt: '2024-12-18T14:00:00Z',
    coverLetter: 'Je suis très motivé par cette opportunité...',
    recruiterNotes: 'Profil intéressant, à recontacter pour un entretien.',
    statusHistory: [
      { status: 'pending', date: '2024-12-15T10:30:00Z' },
      { status: 'reviewed', date: '2024-12-18T14:00:00Z', note: 'CV examiné par le recruteur' },
    ],
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Data Analyst',
    companyName: 'DataFlow',
    companyLogo: '',
    location: 'Lyon',
    appliedAt: '2024-12-10T09:15:00Z',
    status: 'accepted',
    lastUpdatedAt: '2024-12-19T11:00:00Z',
    coverLetter: 'Passionné par l\'analyse de données...',
    recruiterNotes: 'Excellent profil ! Entretien prévu le 22/12.',
    statusHistory: [
      { status: 'pending', date: '2024-12-10T09:15:00Z' },
      { status: 'reviewed', date: '2024-12-14T16:00:00Z' },
      { status: 'accepted', date: '2024-12-19T11:00:00Z', note: 'Entretien prévu' },
    ],
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'UX Designer',
    companyName: 'DesignStudio',
    companyLogo: '',
    location: 'Bordeaux',
    appliedAt: '2024-12-05T14:00:00Z',
    status: 'rejected',
    lastUpdatedAt: '2024-12-12T10:00:00Z',
    statusHistory: [
      { status: 'pending', date: '2024-12-05T14:00:00Z' },
      { status: 'reviewed', date: '2024-12-08T09:00:00Z' },
      { status: 'rejected', date: '2024-12-12T10:00:00Z', note: 'Profil ne correspond pas aux critères' },
    ],
  },
  {
    id: '4',
    jobId: '4',
    jobTitle: 'Product Manager',
    companyName: 'StartupXYZ',
    companyLogo: '',
    location: 'Remote',
    appliedAt: '2024-12-20T08:00:00Z',
    status: 'pending',
    lastUpdatedAt: '2024-12-20T08:00:00Z',
    coverLetter: 'Mon expérience en gestion de produit...',
    statusHistory: [
      { status: 'pending', date: '2024-12-20T08:00:00Z' },
    ],
  },
  {
    id: '5',
    jobId: '5',
    jobTitle: 'DevOps Engineer',
    companyName: 'CloudTech',
    companyLogo: '',
    location: 'Nantes',
    appliedAt: '2024-11-28T11:30:00Z',
    status: 'withdrawn',
    lastUpdatedAt: '2024-12-02T15:00:00Z',
    statusHistory: [
      { status: 'pending', date: '2024-11-28T11:30:00Z' },
      { status: 'withdrawn', date: '2024-12-02T15:00:00Z', note: 'Candidature retirée par le candidat' },
    ],
  },
];

type FilterTab = 'all' | ApplicationStatus;

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [withdrawDialog, setWithdrawDialog] = useState<{
    open: boolean;
    application: Application | null;
  }>({ open: false, application: null });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      // Simulate API call
      setTimeout(() => {
        setApplications(mockApplications);
        setLoading(false);
      }, 1000);
    };

    checkAuth();
  }, [navigate]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (activeTab !== 'all' && app.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.jobTitle.toLowerCase().includes(query) ||
          app.companyName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [applications, activeTab, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      reviewed: applications.filter(a => a.status === 'reviewed').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      withdrawn: applications.filter(a => a.status === 'withdrawn').length,
    };
  }, [applications]);

  const handleWithdraw = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (app) {
      setWithdrawDialog({ open: true, application: app });
    }
  };

  const confirmWithdraw = () => {
    if (withdrawDialog.application) {
      setApplications(prev => prev.map(app => 
        app.id === withdrawDialog.application!.id 
          ? { 
              ...app, 
              status: 'withdrawn' as ApplicationStatus,
              lastUpdatedAt: new Date().toISOString(),
              statusHistory: [
                ...app.statusHistory,
                { 
                  status: 'withdrawn' as ApplicationStatus, 
                  date: new Date().toISOString(),
                  note: 'Candidature retirée par le candidat'
                }
              ]
            }
          : app
      ));
      toast({
        title: 'Candidature retirée',
        description: 'Votre candidature a été retirée avec succès.',
      });
    }
    setWithdrawDialog({ open: false, application: null });
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: 'Export en cours',
      description: `Vos candidatures seront téléchargées en ${format.toUpperCase()}.`,
    });
    // TODO: Implement actual export
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
  };

  const hasFilters = searchQuery !== '' || activeTab !== 'all';

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Mes Candidatures
                </h1>
                <p className="text-muted-foreground mt-1">
                  Suivez l'état de vos candidatures en temps réel
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter en CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter en PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par poste ou entreprise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
              <TabsList className="w-full sm:w-auto flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="all" className="gap-1.5">
                  Toutes
                  <span className="text-xs bg-accent px-1.5 py-0.5 rounded-full">
                    {statusCounts.all}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-1.5">
                  En attente
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                    {statusCounts.pending}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="reviewed" className="gap-1.5">
                  Vues
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                    {statusCounts.reviewed}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="accepted" className="gap-1.5">
                  Acceptées
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                    {statusCounts.accepted}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-1.5">
                  Refusées
                  <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                    {statusCounts.rejected}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results Count */}
          {!loading && filteredApplications.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} trouvée{filteredApplications.length > 1 ? 's' : ''}
            </p>
          )}

          {/* Applications List */}
          <div className="space-y-3">
            {loading ? (
              <>
                <ApplicationCardSkeleton />
                <ApplicationCardSkeleton />
                <ApplicationCardSkeleton />
              </>
            ) : filteredApplications.length === 0 ? (
              <ApplicationsEmptyState 
                hasFilters={hasFilters} 
                onClearFilters={clearFilters}
              />
            ) : (
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onWithdraw={handleWithdraw}
                  onViewJob={handleViewJob}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Withdraw Dialog */}
      {withdrawDialog.application && (
        <WithdrawDialog
          open={withdrawDialog.open}
          onOpenChange={(open) => setWithdrawDialog({ ...withdrawDialog, open })}
          onConfirm={confirmWithdraw}
          jobTitle={withdrawDialog.application.jobTitle}
          companyName={withdrawDialog.application.companyName}
        />
      )}
    </div>
  );
};

export default Applications;
