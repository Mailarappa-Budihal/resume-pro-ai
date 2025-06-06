
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Layout, Download, Eye, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Portfolio = () => {
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
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a template to generate your portfolio.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Portfolio Generated!",
        description: "Your personalized portfolio is ready for download.",
      });
    }, 3000);
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Layout className="w-6 h-6" />
              Portfolio Generator
            </h1>
            <p className="text-gray-600">Create stunning portfolio websites with AI</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Portfolio Configuration
            </CardTitle>
            <CardDescription>
              Customize your portfolio generation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-role">Target Job Role (Optional)</Label>
              <Input
                id="target-role"
                placeholder="e.g., Senior Software Engineer, Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Specify a role to tailor your portfolio content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Template</CardTitle>
            <CardDescription>
              Select a design template that matches your style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 shadow-md' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <Layout className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <div className="mt-2 flex items-center gap-1 text-blue-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Selected
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
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Generate?</h3>
                <p className="text-gray-600">
                  Your portfolio will be generated using your profile data and selected template
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={!selectedTemplate || isGenerating}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={!selectedTemplate || isGenerating}
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
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">AI-Powered Generation</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Automatically generates compelling copy from your resume data</li>
                  <li>• Tailors content to your specified target role</li>
                  <li>• Creates responsive, modern website files</li>
                  <li>• Includes downloadable HTML, CSS, and assets</li>
                  <li>• Optimized for professional presentation</li>
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
