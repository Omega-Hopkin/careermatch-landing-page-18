import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoForm, PersonalInfoFormData } from "@/components/profile/PersonalInfoForm";
import { SkillsSection, Skill } from "@/components/profile/SkillsSection";
import { LanguagesSection, Language } from "@/components/profile/LanguagesSection";
import { CVUpload } from "@/components/profile/CVUpload";
import { ExperiencesSection, Experience, ExperienceFormData } from "@/components/profile/ExperiencesSection";

interface ProfileData {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  filiere: string | null;
  year: string | null;
  remote_preference: string | null;
  cv_url: string | null;
}

const LOCAL_STORAGE_KEY = "careermatch_profile_draft";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string>("");
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Calculate profile completion
  const calculateCompletion = useCallback(() => {
    if (!profile) return 0;
    
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.bio,
      profile.phone,
      profile.location,
      profile.filiere,
      profile.year,
      profile.cv_url,
    ];
    
    const filledFields = fields.filter((f) => f && f.trim() !== "").length;
    const hasSkills = skills.length > 0 ? 1 : 0;
    const hasLanguages = languages.length > 0 ? 1 : 0;
    const hasExperiences = experiences.length > 0 ? 1 : 0;
    
    const total = fields.length + 3; // 3 for skills, languages, experiences
    const filled = filledFields + hasSkills + hasLanguages + hasExperiences;
    
    return Math.round((filled / total) * 100);
  }, [profile, skills, languages, experiences]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }
        
        setUserId(user.id);

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        
        if (profileData) {
          setProfile(profileData as ProfileData);
        }

        // Load skills
        const { data: skillsData, error: skillsError } = await supabase
          .from("student_skills")
          .select("*")
          .eq("user_id", user.id);

        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        // Load languages
        const { data: languagesData, error: languagesError } = await supabase
          .from("student_languages")
          .select("*")
          .eq("user_id", user.id);

        if (languagesError) throw languagesError;
        setLanguages(languagesData || []);

        // Load experiences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from("student_experiences")
          .select("*")
          .eq("user_id", user.id);

        if (experiencesError) throw experiencesError;
        setExperiences(experiencesData || []);

        // Check for draft
        const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (draft) {
          const draftData = JSON.parse(draft);
          if (draftData.userId === user.id) {
            toast({
              title: "Brouillon récupéré",
              description: "Vos modifications non enregistrées ont été restaurées.",
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast]);

  // Auto-save draft
  useEffect(() => {
    if (isEditing && profile) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ userId, profile, timestamp: Date.now() })
      );
    }
  }, [profile, isEditing, userId]);

  // Warn on page leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing]);

  // Personal info handlers
  const handleSavePersonalInfo = async (data: PersonalInfoFormData) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("user_id", userId);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...data } : null);
      setIsEditing(false);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      toast({
        title: "Succès",
        description: "Profil mis à jour",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Skills handlers
  const handleAddSkill = async (name: string, level: string) => {
    try {
      const { data, error } = await supabase
        .from("student_skills")
        .insert({ user_id: userId, skill_name: name, skill_level: level })
        .select()
        .single();

      if (error) throw error;
      setSkills((prev) => [...prev, data]);
      
      toast({ title: "Compétence ajoutée" });
    } catch (error) {
      console.error("Error adding skill:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la compétence",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from("student_skills")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSkills((prev) => prev.filter((s) => s.id !== id));
      
      toast({ title: "Compétence supprimée" });
    } catch (error) {
      console.error("Error removing skill:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    }
  };

  // Languages handlers
  const handleAddLanguage = async (name: string, level: string) => {
    try {
      const { data, error } = await supabase
        .from("student_languages")
        .insert({ user_id: userId, language_name: name, proficiency_level: level })
        .select()
        .single();

      if (error) throw error;
      setLanguages((prev) => [...prev, data]);
      
      toast({ title: "Langue ajoutée" });
    } catch (error) {
      console.error("Error adding language:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la langue",
        variant: "destructive",
      });
    }
  };

  const handleRemoveLanguage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("student_languages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setLanguages((prev) => prev.filter((l) => l.id !== id));
      
      toast({ title: "Langue supprimée" });
    } catch (error) {
      console.error("Error removing language:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la langue",
        variant: "destructive",
      });
    }
  };

  // Experiences handlers
  const handleAddExperience = async (data: ExperienceFormData) => {
    try {
      const { data: newExp, error } = await supabase
        .from("student_experiences")
        .insert([{
          user_id: userId,
          title: data.title,
          company: data.company,
          experience_type: data.experience_type,
          start_date: data.start_date,
          end_date: data.end_date || null,
          is_current: data.is_current,
          description: data.description || null,
        }])
        .select()
        .single();

      if (error) throw error;
      setExperiences((prev) => [...prev, newExp]);
      
      toast({ title: "Expérience ajoutée" });
    } catch (error) {
      console.error("Error adding experience:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'expérience",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExperience = async (id: string, data: ExperienceFormData) => {
    try {
      const { data: updatedExp, error } = await supabase
        .from("student_experiences")
        .update({
          ...data,
          end_date: data.end_date || null,
          description: data.description || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setExperiences((prev) => prev.map((e) => (e.id === id ? updatedExp : e)));
      
      toast({ title: "Expérience modifiée" });
    } catch (error) {
      console.error("Error updating experience:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'expérience",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from("student_experiences")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      
      toast({ title: "Expérience supprimée" });
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expérience",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profil non trouvé</p>
      </div>
    );
  }

  const personalInfoData: PersonalInfoFormData = {
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    filiere: profile.filiere || "",
    year: profile.year || "",
    bio: profile.bio || "",
    phone: profile.phone || "",
    location: profile.location || "",
    remote_preference: profile.remote_preference || "hybrid",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>

        {/* Profile Header */}
        <ProfileHeader
          firstName={profile.first_name || ""}
          lastName={profile.last_name || ""}
          email={profile.email || ""}
          avatarUrl={profile.avatar_url}
          location={profile.location}
          profileCompletion={calculateCompletion()}
          userId={userId}
          onAvatarUpdate={(url) => setProfile((prev) => prev ? { ...prev, avatar_url: url } : null)}
        />

        {/* Personal Info */}
        <PersonalInfoForm
          data={personalInfoData}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onSave={handleSavePersonalInfo}
          isSaving={saving}
        />

        {/* Two column layout for skills and languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillsSection
            skills={skills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            isLoading={saving}
          />
          <LanguagesSection
            languages={languages}
            onAddLanguage={handleAddLanguage}
            onRemoveLanguage={handleRemoveLanguage}
            isLoading={saving}
          />
        </div>

        {/* CV Upload */}
        <CVUpload
          cvUrl={profile.cv_url}
          userId={userId}
          onCVUpdate={(url) => setProfile((prev) => prev ? { ...prev, cv_url: url } : null)}
        />

        {/* Experiences */}
        <ExperiencesSection
          experiences={experiences}
          onAddExperience={handleAddExperience}
          onUpdateExperience={handleUpdateExperience}
          onDeleteExperience={handleDeleteExperience}
          isLoading={saving}
        />
      </div>
    </div>
  );
}
