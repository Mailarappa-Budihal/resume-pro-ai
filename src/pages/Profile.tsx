
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Upload, User, FileText, CheckCircle, AlertCircle, Loader2, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResumeUpload } from '@/components/ResumeUpload';
import { ExtractedProfileData } from '@/components/ExtractedProfileData';
import { useProfileData } from '@/hooks/useProfileData';

const Profile = () => {
  const { profileData, isLoading, updateProfile } = useProfileData();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleResumeProcessed = (extractedData: any) => {
    updateProfile(extractedData);
    toast({
      title: "Profile Updated Successfully!",
      description: "Your resume data has been extracted and saved to your profile.",
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
            <p className="text-gray-600">Upload your resume and manage your professional profile</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Resume Upload Section */}
        <ResumeUpload 
          onResumeProcessed={handleResumeProcessed}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />

        {/* Profile Data Display */}
        {profileData && (
          <ExtractedProfileData 
            profileData={profileData}
            onUpdate={updateProfile}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span>Loading your profile data...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
