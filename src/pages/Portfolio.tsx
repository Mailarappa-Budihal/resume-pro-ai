import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Layout, Download, Eye, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfileData';
import { generatePortfolio } from '@/services/aiService';
import JSZip from 'jszip';

const Portfolio = () => {
  const { profileData } = useProfileData();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Developer',
      description: 'Clean, minimalist design perfect for tech roles',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'creative',
      name: 'Creative Professional',
      description: 'Bold, colorful design for creative positions',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Professional, corporate-friendly layout',
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'startup',
      name: 'Startup Ready',
      description: 'Dynamic design for fast-paced environments',
      preview: '/api/placeholder/300/200'
    }
  ];

  const handleGenerate = async () => {
    if (!profileData) {
      toast({
        title: "Profile Required",
        description: "Please upload your resume and extract profile data first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a template to generate your portfolio.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const portfolioFiles = await generatePortfolio(profileData, selectedTemplate, targetRole);
      
      // Create and download ZIP file
      const zip = new JSZip();
      zip.file('index.html', portfolioFiles.html);
      zip.file('styles.css', portfolioFiles.css);
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profileData.personalInfo.name.replace(/\s+/g, '_')}_Portfolio.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Portfolio Generated Successfully!",
        description: "Your personalized portfolio has been downloaded as a ZIP file.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Layout className="w-6 h-6" />
              AI Portfolio Generator
            </h1>
            <p className="text-gray-600">Create stunning portfolio websites with AI-powered content generation</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Profile Status */}
        {!profileData ? (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Profile Data Required</h3>
                  <p className="text-orange-800 mb-3">
                    To generate a personalized portfolio, please upload your resume and extract your profile data first.
                  </p>
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Go to Profile →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Profile Ready</h3>
                  <p className="text-green-800">
                    Your profile data is loaded and ready for portfolio generation. 
                    Profile includes {profileData.experience.length} work experiences, 
                    {profileData.skills.technical.length} technical skills, and {profileData.projects.length} projects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Portfolio Configuration
            </CardTitle>
            <CardDescription>
              Customize your portfolio generation settings for optimal results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-role">Target Job Role (Optional)</Label>
              <Input
                id="target-role"
                placeholder="e.g., Senior Software Engineer, Frontend Developer, Full Stack Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Specify a role to tailor your portfolio content and highlight relevant skills
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Template</CardTitle>
            <CardDescription>
              Select a professional design template that matches your style and target role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 shadow-md bg-blue-50' 
                      : 'hover:shadow-lg hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Layout className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Selected Template
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Generate Your Portfolio?</h3>
                <p className="text-gray-600">
                  {profileData 
                    ? "Your portfolio will be generated using your extracted profile data and selected template"
                    : "Upload your resume first to enable portfolio generation"
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={!profileData || !selectedTemplate || isGenerating}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={!profileData || !selectedTemplate || isGenerating}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate Portfolio
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Features Info */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">AI-Powered Portfolio Generation</h3>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Automatically generates compelling copy from your extracted resume data</li>
                  <li>• Tailors content to your specified target role and experience level</li>
                  <li>• Creates responsive, modern website files optimized for all devices</li>
                  <li>• Includes downloadable HTML, CSS, and complete portfolio package</li>
                  <li>• Optimized for professional presentation and ATS compatibility</li>
                  <li>• Uses advanced AI to highlight your most relevant achievements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;
