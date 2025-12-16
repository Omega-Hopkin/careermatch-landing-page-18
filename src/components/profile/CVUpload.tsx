import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Download, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVUploadProps {
  cvUrl: string | null;
  userId: string;
  onCVUpdate: (url: string | null) => void;
}

export function CVUpload({ cvUrl, userId, onCVUpdate }: CVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "Le fichier ne doit pas dépasser 5 Mo",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Erreur",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const filePath = `${userId}/cv.pdf`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(100);

      // Get signed URL for private bucket
      const { data: signedUrlData } = await supabase.storage
        .from("cvs")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

      const cvUrlToSave = signedUrlData?.signedUrl || filePath;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cv_url: cvUrlToSave })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onCVUpdate(cvUrlToSave);
      toast({
        title: "Succès",
        description: "CV téléchargé avec succès",
      });
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le CV",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [userId]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemoveCV = async () => {
    try {
      const { error: deleteError } = await supabase.storage
        .from("cvs")
        .remove([`${userId}/cv.pdf`]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cv_url: null })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onCVUpdate(null);
      toast({
        title: "Succès",
        description: "CV supprimé",
      });
    } catch (error) {
      console.error("Error removing CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le CV",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CV</CardTitle>
      </CardHeader>
      <CardContent>
        {cvUrl ? (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Mon CV</p>
                <p className="text-sm text-muted-foreground">PDF</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleRemoveCV}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${isDragging 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
          >
            {uploading ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <CheckCircle className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground">Téléchargement en cours...</p>
                <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-foreground font-medium">
                  Glissez-déposez votre CV ici
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou cliquez pour parcourir
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Format: PDF uniquement • Max: 5 Mo
                </p>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
