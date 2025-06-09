
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfileData(null);
      setIsLoading(false);
      return;
    }

    loadProfileData();
  }, [user, isAuthenticated]);

  const loadProfileData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Load work experience
      const { data: workExperience } = await supabase
        .from('work_experience')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      // Load education
      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      // Load projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (profile) {
        const formattedData: ProfileData = {
          personalInfo: {
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            title: '', // We might want to add this field to the profile table
            summary: profile.summary || '',
          },
          experience: workExperience?.map(exp => ({
            company: exp.company,
            position: exp.position,
            duration: `${exp.start_date || 'Unknown'} - ${exp.is_current ? 'Present' : exp.end_date || 'Unknown'}`,
            description: exp.description || '',
            achievements: [], // We might want to store this as JSON in the database
          })) || [],
          education: education?.map(edu => ({
            institution: edu.institution,
            degree: edu.degree || '',
            field: edu.field_of_study || '',
            duration: `${edu.start_date || 'Unknown'} - ${edu.end_date || 'Unknown'}`,
            gpa: edu.gpa?.toString() || '',
          })) || [],
          skills: {
            technical: profile.skills || [],
            soft: [], // We might want to separate these in the database
          },
          projects: projects?.map(proj => ({
            name: proj.title,
            description: proj.description || '',
            technologies: proj.technologies || [],
            link: proj.url || proj.github_url || '',
          })) || [],
        };

        setProfileData(formattedData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (newProfileData: ProfileData) => {
    if (!user) return;

    try {
      // Update profile
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: newProfileData.personalInfo.name.split(' ')[0],
          last_name: newProfileData.personalInfo.name.split(' ').slice(1).join(' '),
          email: newProfileData.personalInfo.email,
          phone: newProfileData.personalInfo.phone,
          location: newProfileData.personalInfo.location,
          summary: newProfileData.personalInfo.summary,
          skills: newProfileData.skills.technical,
        });

      // Update local state
      setProfileData(newProfileData);
      
      // Optionally reload from database to ensure consistency
      await loadProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return {
    profileData,
    isLoading,
    updateProfile,
    refreshProfile: loadProfileData,
  };
};
