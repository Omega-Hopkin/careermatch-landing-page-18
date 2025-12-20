import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { JobCard, Job } from '@/components/dashboard/JobCard';
import { JobDetailModal } from '@/components/dashboard/JobDetailModal';
import { SearchBar } from '@/components/jobs/SearchBar';
import { FiltersSidebar } from '@/components/jobs/FiltersSidebar';
import { ActiveFilters, FilterState } from '@/components/jobs/ActiveFilters';
import { JobGridSkeleton } from '@/components/jobs/JobCardSkeleton';
import { EmptyState, ErrorState } from '@/components/jobs/JobSearchStates';

// Mock jobs data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Développeur Full Stack React/Node.js',
    company: 'TechStart SAS',
    location: 'Paris',
    isRemote: true,
    matchScore: 92,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Stage Data Analyst',
    company: 'DataViz Corp',
    location: 'Lyon',
    isRemote: false,
    matchScore: 78,
    skills: ['Python', 'SQL', 'Tableau'],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'UX/UI Designer Junior',
    company: 'Creative Agency',
    location: 'Bordeaux',
    isRemote: true,
    matchScore: 85,
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Chef de Projet Digital',
    company: 'MediaGroup',
    location: 'Paris',
    isRemote: false,
    matchScore: 65,
    skills: ['Agile', 'Jira', 'Communication'],
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Développeur Mobile React Native',
    company: 'AppFactory',
    location: 'Toulouse',
    isRemote: true,
    matchScore: 88,
    skills: ['React Native', 'TypeScript', 'Firebase'],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Alternance Marketing Digital',
    company: 'GrowthHackers',
    location: 'Nantes',
    isRemote: false,
    matchScore: 72,
    skills: ['SEO', 'Google Ads', 'Analytics'],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'CloudSolutions',
    location: 'Lille',
    isRemote: true,
    matchScore: 81,
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    title: 'Business Developer B2B',
    company: 'SalesForce Pro',
    location: 'Marseille',
    isRemote: false,
    matchScore: 58,
    skills: ['Négociation', 'CRM', 'Prospection'],
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialFilters: FilterState = {
  jobTypes: [],
  location: '',
  remote: '',
  experience: '',
  skills: [],
  postedDate: '',
};

const ITEMS_PER_PAGE = 6;

const JobSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState('relevance');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isError, setIsError] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...mockJobs];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Remote filter
    if (filters.remote) {
      if (filters.remote === 'remote') {
        result = result.filter(job => job.isRemote);
      } else if (filters.remote === 'sur-site') {
        result = result.filter(job => !job.isRemote);
      }
      // 'hybride' would need additional data
    }

    // Skills filter
    if (filters.skills.length > 0) {
      result = result.filter(job =>
        filters.skills.some(skill =>
          job.skills.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Posted date filter
    if (filters.postedDate) {
      const now = new Date();
      result = result.filter(job => {
        const postedDate = new Date(job.postedAt);
        const daysDiff = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.postedDate) {
          case 'today':
            return daysDiff < 1;
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'match':
        result.sort((a, b) => b.matchScore - a.matchScore);
        break;
      default: // relevance - keep default order
        break;
    }

    return result;
  }, [debouncedSearch, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRemoveFilter = (key: keyof FilterState, value?: string) => {
    if (key === 'jobTypes' && value) {
      setFilters(prev => ({
        ...prev,
        jobTypes: prev.jobTypes.filter(t => t !== value)
      }));
    } else if (key === 'skills' && value) {
      setFilters(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: typeof prev[key] === 'string' ? '' : []
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        toast({ title: 'Offre retirée des favoris' });
      } else {
        newSet.add(jobId);
        toast({ title: 'Offre sauvegardée!' });
      }
      return newSet;
    });
  };

  const handleApply = (jobId: string) => {
    toast({ title: 'Candidature envoyée!', description: 'Bonne chance!' });
  };

  const handleJobClick = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              Rechercher des opportunités
            </h1>
            <p className="text-muted-foreground">
              Découvrez les offres qui correspondent à votre profil
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Active Filters */}
          <div className="mb-6">
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <FiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClearAll={handleClearFilters}
            />

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredJobs.length}</span> opportunités trouvées
                </p>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="match">Match score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Error State */}
              {isError ? (
                <ErrorState onRetry={() => setIsError(false)} />
              ) : loading ? (
                <JobGridSkeleton />
              ) : filteredJobs.length === 0 ? (
                <EmptyState onClearFilters={handleClearFilters} />
              ) : (
                <>
                  {/* Job Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {paginatedJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onSave={() => handleSaveJob(job.id)}
                        onApply={() => handleApply(job.id)}
                        onClick={() => handleJobClick(job)}
                        isSaved={savedJobs.has(job.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default JobSearch;
