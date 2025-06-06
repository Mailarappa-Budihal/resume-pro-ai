
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Briefcase, MapPin, Clock, ExternalLink, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobSearch = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobType, setJobType] = useState('');
  const [resultsLimit, setResultsLimit] = useState('20');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!jobTitle.trim()) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title to search for positions.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate job search
    setTimeout(() => {
      setIsSearching(false);
      setSearched(true);
      toast({
        title: "Search Complete!",
        description: `Found ${mockJobs.length} job opportunities matching your criteria.`,
      });
    }, 2000);
  };

  const mockJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "Senior",
      posted: "2 days ago",
      description: "We're looking for a senior software engineer to join our growing team...",
      url: "https://linkedin.com/jobs/123456"
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      experience: "Mid-level",
      posted: "1 week ago",
      description: "Join our innovative startup as a full stack developer...",
      url: "https://linkedin.com/jobs/789012"
    },
    {
      id: 3,
      title: "Frontend Engineer",
      company: "DesignHub",
      location: "New York, NY",
      type: "Full-time",
      experience: "Mid-level",
      posted: "3 days ago",
      description: "We need a creative frontend engineer who loves building beautiful UIs...",
      url: "https://linkedin.com/jobs/345678"
    },
    {
      id: 4,
      title: "Software Developer",
      company: "InnovateLab",
      location: "Austin, TX",
      type: "Full-time",
      experience: "Entry-level",
      posted: "5 days ago",
      description: "Great opportunity for a junior developer to grow with our team...",
      url: "https://linkedin.com/jobs/901234"
    },
    {
      id: 5,
      title: "React Developer",
      company: "WebSolutions",
      location: "Seattle, WA",
      type: "Contract",
      experience: "Mid-level",
      posted: "1 day ago",
      description: "Contract position for an experienced React developer...",
      url: "https://linkedin.com/jobs/567890"
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Job Search
            </h1>
            <p className="text-gray-600">Find relevant job opportunities with LinkedIn integration</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>
              Configure your job search criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="experience-level">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="job-type">Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label htmlFor="results-limit">Results Limit</Label>
              <Select value={resultsLimit} onValueChange={setResultsLimit}>
                <SelectTrigger>
                  <SelectValue placeholder="Number of results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 results</SelectItem>
                  <SelectItem value="20">20 results</SelectItem>
                  <SelectItem value="50">50 results</SelectItem>
                  <SelectItem value="100">100 results</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSearch}
              disabled={isSearching || !jobTitle.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search Jobs
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {searched && (
          <>
            {/* Search Results */}
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  Found {mockJobs.length} job opportunities matching your criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(job.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on LinkedIn
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm">{job.description}</p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {job.experience}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Save Job
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Quick Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* AI-Powered Suggestions */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">AI-Powered Job Suggestions</CardTitle>
            <CardDescription className="text-purple-700">
              Based on your profile, we recommend these additional search terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['React Developer', 'Full Stack Engineer', 'Frontend Developer', 'JavaScript Engineer', 'Node.js Developer'].map((term) => (
                <Button 
                  key={term}
                  variant="outline" 
                  size="sm"
                  className="text-purple-700 border-purple-300 hover:bg-purple-100"
                  onClick={() => setJobTitle(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">LinkedIn Integration</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Real-time job data from LinkedIn's extensive database</li>
                  <li>• Advanced filtering by location, experience, and job type</li>
                  <li>• Direct links to original job postings for easy application</li>
                  <li>• AI-powered job recommendations based on your profile</li>
                  <li>• Save and track your job applications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobSearch;
