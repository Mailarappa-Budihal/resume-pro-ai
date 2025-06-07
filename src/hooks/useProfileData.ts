
import { useState, useEffect } from 'react';

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

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from database
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // In production, this would fetch from Supabase
        const savedProfile = localStorage.getItem('portfolioai_profile');
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const updateProfile = (newProfileData: ProfileData) => {
    setProfileData(newProfileData);
    // In production, this would save to Supabase
    localStorage.setItem('portfolioai_profile', JSON.stringify(newProfileData));
  };

  return {
    profileData,
    isLoading,
    updateProfile
  };
};
