import { useState, useRef } from "react";
import { Camera, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  location: string | null;
  profileCompletion: number;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

export function ProfileHeader({
  firstName,
  lastName,
  email,
  avatarUrl,
  location,
  profileCompletion,
  userId,
  onAvatarUpdate,
}: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5 Mo",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onAvatarUpdate(data.publicUrl);
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src={avatarUrl || undefined} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleAvatarClick}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-foreground/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-6 w-6 text-background" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-foreground">
            {firstName && lastName ? `${firstName} ${lastName}` : "Complétez votre profil"}
          </h1>
          <p className="text-muted-foreground">{email}</p>
          {location && (
            <div className="flex items-center gap-1 mt-1 justify-center md:justify-start text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>

        <div className="w-full md:w-48">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Profil complété</span>
            <span className="font-medium text-foreground">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>
      </div>
    </div>
  );
}
