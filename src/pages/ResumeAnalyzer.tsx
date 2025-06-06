
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, AlertCircle, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to analyze your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been analyzed against the job requirements.",
      });
    }, 3000);
  };

  const analysisResults = {
    atsScore: 78,
    overallMatch: 85,
    sections: {
      skills: { score: 90, status: 'excellent' },
      experience: { score: 80, status: 'good' },
      education: { score: 75, status: 'good' },
      keywords: { score: 70, status: 'needs-improvement' }
    }
  };

  const suggestions = [
    {
      type: 'critical',
      icon: XCircle,
      title: 'Missing Key Skills',
      description: 'Add "Docker" and "Kubernetes" to your skills section - these are required qualifications.',
      action: 'Add to skills section'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Weak Keywords Match',
      description: 'Include more industry-specific keywords like "microservices", "CI/CD", and "agile development".',
      action: 'Optimize keywords'
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Strong Experience Match',
      description: 'Your experience aligns well with the job requirements. Great job!',
      action: 'No action needed'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Quantify Achievements',
      description: 'Add specific metrics and numbers to your accomplishments for greater impact.',
      action: 'Add metrics'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs-improvement': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-6 h-6" />
              Resume Analyzer
            </h1>
            <p className="text-gray-600">Get ATS scores and improvement suggestions</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Job Description Input */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description Analysis</CardTitle>
            <CardDescription>
              Paste the job description to analyze your resume compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="mt-2"
              />
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analyzed && (
          <>
            {/* ATS Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">ATS Compatibility Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${analysisResults.atsScore}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{analysisResults.atsScore}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600">Likely to pass ATS screening</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Overall Job Match</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${analysisResults.overallMatch}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{analysisResults.overallMatch}%</span>
                    </div>
                  </div>
                  <p className="text-gray-600">Strong candidate match</p>
                </CardContent>
              </Card>
            </div>

            {/* Section Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Section-by-Section Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of how each resume section performs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysisResults.sections).map(([section, data]) => (
                  <div key={section} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 capitalize">{section}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                          {data.status.replace('-', ' ')}
                        </span>
                      </div>
                      <Progress value={data.score} className="h-2" />
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-lg font-semibold text-gray-900">{data.score}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Improvement Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>
                  AI-powered recommendations to enhance your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <suggestion.icon className={`w-5 h-5 mt-0.5 ${getSuggestionColor(suggestion.type)}`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{suggestion.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{suggestion.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                      >
                        {suggestion.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* AI Features Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Analysis Features</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• ATS compatibility scoring based on industry standards</li>
                  <li>• Keyword density analysis and optimization suggestions</li>
                  <li>• Section-by-section performance evaluation</li>
                  <li>• Actionable recommendations for improvement</li>
                  <li>• Job-specific matching and alignment scoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
