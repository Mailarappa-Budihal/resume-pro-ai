
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, GraduationCap, Code, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    duration: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

interface ExtractedProfileDataProps {
  profileData: ProfileData;
  onUpdate: (data: ProfileData) => void;
}

export const ExtractedProfileData = ({ profileData, onUpdate }: ExtractedProfileDataProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<ProfileData>(profileData);
  const { toast } = useToast();

  const handleSave = (section: string) => {
    onUpdate(editedData);
    setIsEditing(null);
    toast({
      title: "Profile Updated",
      description: `${section} information has been saved.`,
    });
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(isEditing === 'personal' ? null : 'personal')}
            >
              {isEditing === 'personal' ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing === 'personal' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedData.personalInfo.name}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, name: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editedData.personalInfo.email}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, email: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedData.personalInfo.phone}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, phone: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editedData.personalInfo.location}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      personalInfo: { ...editedData.personalInfo, location: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={editedData.personalInfo.title}
                  onChange={(e) => setEditedData({
                    ...editedData,
                    personalInfo: { ...editedData.personalInfo, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={editedData.personalInfo.summary}
                  onChange={(e) => setEditedData({
                    ...editedData,
                    personalInfo: { ...editedData.personalInfo, summary: e.target.value }
                  })}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave('Personal')} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">{profileData.personalInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{profileData.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{profileData.personalInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-900">{profileData.personalInfo.location}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Professional Title</p>
                <p className="text-gray-900">{profileData.personalInfo.title}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Professional Summary</p>
                <p className="text-gray-900">{profileData.personalInfo.summary}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileData.experience.map((exp, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4">
              <h3 className="font-semibold text-gray-900">{exp.position}</h3>
              <p className="text-blue-600 font-medium">{exp.company}</p>
              <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
              <p className="text-gray-700 mb-2">{exp.description}</p>
              {exp.achievements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Key Achievements:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.technical.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Soft Skills</p>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.soft.map((skill, index) => (
                <Badge key={index} variant="outline" className="border-green-200 text-green-800">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.education.map((edu, index) => (
            <div key={index} className="border-l-4 border-green-200 pl-4">
              <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
              <p className="text-green-600 font-medium">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.duration}</p>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      {profileData.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileData.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-purple-200 pl-4">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} className="text-blue-600 hover:underline text-sm">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
