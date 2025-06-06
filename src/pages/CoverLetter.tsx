
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Mail, Sparkles, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CoverLetter = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to generate your cover letter.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      toast({
        title: "Cover Letter Generated!",
        description: "Your personalized cover letter is ready.",
      });
    }, 3000);
  };

  const generatedLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at your company. With over 3 years of experience in full-stack development and a proven track record of delivering scalable web applications, I am excited about the opportunity to contribute to your innovative team.

In my current role at TechCorp Inc., I have successfully developed and maintained multiple web applications using React, Node.js, and AWS - technologies that align perfectly with your requirements. I have led the development of a customer portal that serves over 50,000 daily active users with 99.9% uptime, demonstrating my ability to build robust, scalable solutions.

Your job posting mentions the need for experience with cloud technologies and DevOps practices. I have extensive hands-on experience with AWS services, Docker containerization, and CI/CD pipelines, having implemented automated deployment processes that reduced deployment time by 70% and significantly improved our team's productivity.

What particularly excites me about this opportunity is your company's commitment to innovation and the chance to work on cutting-edge projects. I am passionate about writing clean, efficient code and collaborating with cross-functional teams to deliver exceptional user experiences.

I would welcome the opportunity to discuss how my technical skills, problem-solving abilities, and passion for software development can contribute to your team's success. Thank you for considering my application.

Best regards,
Alex Johnson`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Cover Letter Generator
            </h1>
            <p className="text-gray-600">Generate tailored cover letters with AI</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Job Description Input */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the job description to generate a tailored cover letter
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
              onClick={handleGenerate}
              disabled={isGenerating || !jobDescription.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {generated && (
          <>
            {/* Generated Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  Your Personalized Cover Letter
                </CardTitle>
                <CardDescription>
                  AI-generated cover letter tailored to the job description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="whitespace-pre-line text-gray-900 font-mono text-sm leading-relaxed">
                    {generatedLetter}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCopy}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </Button>
                  <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4" />
                    Download as DOCX
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips for Customization */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-amber-800 space-y-2 text-sm">
                  <li>• Always personalize the company name and hiring manager's name if available</li>
                  <li>• Review and adjust the letter to match your personal writing style</li>
                  <li>• Add specific examples from your experience that aren't in your resume</li>
                  <li>• Keep the letter concise and focused on the most relevant qualifications</li>
                  <li>• Proofread carefully before sending</li>
                </ul>
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
                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Cover Letter Features</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Analyzes job requirements to highlight relevant experience</li>
                  <li>• Incorporates your resume data for personalized content</li>
                  <li>• Maintains professional tone and structure</li>
                  <li>• Tailors language to match company culture and role level</li>
                  <li>• Includes quantifiable achievements and specific examples</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetter;
