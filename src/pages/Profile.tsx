
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Upload, User, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const { toast } = useToast();

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setResumeUploaded(true);
      toast({
        title: "Resume Uploaded Successfully!",
        description: "Your profile has been updated with the extracted information.",
      });
    }, 2000);
  };

  const profileData = {
    name: "Alex Johnson",
    email: "demo@portfolioai.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Software Engineer",
    summary: "Passionate software engineer with 3+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "MongoDB", "PostgreSQL"],
    experience: [
      {
        company: "TechCorp Inc.",
        position: "Software Engineer",
        duration: "2022 - Present",
        description: "Developed and maintained web applications using React and Node.js"
      },
      {
        company: "StartupXYZ",
        position: "Junior Developer",
        duration: "2021 - 2022",
        description: "Built responsive web interfaces and implemented REST APIs"
      }
    ]
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your profile and upload your resume</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Resume Upload Card */}
        <Card className={resumeUploaded ? "border-green-200 bg-green-50" : "border-dashed border-2 border-gray-300"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {resumeUploaded ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Upload className="w-5 h-5" />}
              Resume Upload
            </CardTitle>
            <CardDescription>
              {resumeUploaded 
                ? "Your resume has been processed and your profile updated"
                : "Upload your resume to automatically populate your profile data"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!resumeUploaded ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Resume</h3>
                <p className="text-gray-600 mb-4">Supported formats: PDF, DOCX</p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button disabled={isUploading} className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {isUploading ? "Processing..." : "Choose File"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">resume_alex_johnson.pdf</p>
                    <p className="text-sm text-green-700">Processed successfully</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Replace
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {resumeUploaded && (
          <>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your personal and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profileData.name} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileData.email} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={profileData.phone} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={profileData.location} readOnly />
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" value={profileData.title} readOnly />
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea id="summary" value={profileData.summary} readOnly rows={3} />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Technical skills extracted from your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Professional experience from your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
