-- Add extended fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS filiere TEXT,
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS remote_preference TEXT DEFAULT 'hybrid',
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Create student_skills table
CREATE TABLE public.student_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_level TEXT NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skills" ON public.student_skills
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" ON public.student_skills
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" ON public.student_skills
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON public.student_skills
FOR DELETE USING (auth.uid() = user_id);

-- Create student_languages table
CREATE TABLE public.student_languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_name TEXT NOT NULL,
  proficiency_level TEXT NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own languages" ON public.student_languages
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own languages" ON public.student_languages
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own languages" ON public.student_languages
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own languages" ON public.student_languages
FOR DELETE USING (auth.uid() = user_id);

-- Create student_experiences table
CREATE TABLE public.student_experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  experience_type TEXT NOT NULL DEFAULT 'stage',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own experiences" ON public.student_experiences
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" ON public.student_experiences
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON public.student_experiences
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON public.student_experiences
FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_student_experiences_updated_at
BEFORE UPDATE ON public.student_experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('cvs', 'cvs', false, 5242880, ARRAY['application/pdf']);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for CVs
CREATE POLICY "Users can view their own CV" ON storage.objects
FOR SELECT USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own CV" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CV" ON storage.objects
FOR UPDATE USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CV" ON storage.objects
FOR DELETE USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);