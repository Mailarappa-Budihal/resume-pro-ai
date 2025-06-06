
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FileText, Sparkles, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeOptimizer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to optimize your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    // Simulate AI optimization
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimized(true);
      toast({
        title: "Resume Optimized!",
        description: "Your resume has been tailored for this specific role.",
      });
    }, 3000);
  };

  const suggestions = [
    {
      section: "Professional Summary",
      original: "Experienced software engineer with full-stack development skills.",
      optimized: "Results-driven software engineer with 3+ years of full-stack development experience in React, Node.js, and cloud technologies, specializing in scalable web applications.",
      reason: "Added specific years of experience and key technologies mentioned in the job description."
    },
    {
      section: "Skills",
      original: "JavaScript, React, Node.js, Python",
      optimized: "JavaScript, React.js, Node.js, Python, AWS, Docker, Kubernetes, TypeScript",
      reason: "Added cloud technologies and DevOps tools that are requirements in the job posting."
    },
    {
      section: "Experience",
      original: "Developed web applications using modern frameworks",
      optimized: "Developed and deployed 15+ scalable web applications using React.js and Node.js, serving 50,000+ daily active users with 99.9% uptime",
      reason: "Added quantifiable metrics and specific impact numbers that align with the role's requirements."
    }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Resume Optimizer
            </h1>
            <p className="text-gray-600">Optimize your resume for specific job roles with AI</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Job Description Input */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the job description to optimize your resume
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
              onClick={handleOptimize}
              disabled={isOptimizing || !jobDescription.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Optimize Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {optimized && (
          <>
            {/* Optimization Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Optimization Complete
                </CardTitle>
                <CardDescription>
                  Here are the AI-generated improvements for your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-gray-600">Match Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-gray-600">Improvements</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Re-optimize
                    </Button>
                    <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
                <CardDescription>
                  Review the AI-suggested improvements to your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{suggestion.section}</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-800 mb-1">Original:</p>
                        <p className="text-red-700">{suggestion.original}</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-1">Optimized:</p>
                        <p className="text-green-700">{suggestion.optimized}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">Why this change:</p>
                        <p className="text-blue-700 text-sm">{suggestion.reason}</p>
                      </div>
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
                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Optimization Features</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Analyzes job description for key requirements and keywords</li>
                  <li>• Tailors your experience bullets to match role expectations</li>
                  <li>• Suggests relevant skills and technologies to highlight</li>
                  <li>• Optimizes for Applicant Tracking Systems (ATS)</li>
                  <li>• Provides quantifiable improvements and metrics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
