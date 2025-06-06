
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Layout, 
  FileText, 
  Search, 
  Mail, 
  Briefcase, 
  MessageSquare,
  User,
  Upload,
  Star,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Portfolio Generator",
      description: "Create stunning portfolio websites with AI",
      icon: Layout,
      path: "/portfolio",
      color: "bg-blue-500"
    },
    {
      title: "Resume Optimizer",
      description: "Optimize your resume for specific job roles",
      icon: FileText,
      path: "/resume-optimizer",
      color: "bg-green-500"
    },
    {
      title: "Resume Analyzer",
      description: "Get ATS scores and improvement suggestions",
      icon: Search,
      path: "/resume-analyzer",
      color: "bg-purple-500"
    },
    {
      title: "Cover Letter Generator",
      description: "Generate tailored cover letters",
      icon: Mail,
      path: "/cover-letter",
      color: "bg-orange-500"
    },
    {
      title: "Job Search",
      description: "Find relevant job opportunities",
      icon: Briefcase,
      path: "/job-search",
      color: "bg-red-500"
    },
    {
      title: "Interview Simulator",
      description: "Practice with AI-powered mock interviews",
      icon: MessageSquare,
      path: "/interview-simulator",
      color: "bg-indigo-500"
    }
  ];

  const stats = [
    { label: "Tools Used", value: "3", icon: Star },
    { label: "Resume Score", value: "85%", icon: TrendingUp },
    { label: "Jobs Applied", value: "12", icon: Briefcase }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Let's boost your career today.</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Profile Completion Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Setup
                </CardTitle>
                <CardDescription>
                  Complete your profile to unlock all AI-powered features
                </CardDescription>
              </div>
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-sm text-gray-600">
                Upload your resume to unlock personalized AI recommendations
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Tools Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Career Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card 
                key={tool.title} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => navigate(tool.path)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center`}>
                      <tool.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest career development actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Resume optimized for Software Engineer role</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Job search completed - 15 results found</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mock interview completed - Great performance!</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
