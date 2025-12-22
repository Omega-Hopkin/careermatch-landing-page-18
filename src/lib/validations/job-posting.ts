import { z } from 'zod';

export const jobPostingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne peut pas dépasser 100 caractères"),
  jobType: z.enum(['stage', 'cdi', 'cdd', 'freelance', 'alternance'], {
    required_error: "Veuillez sélectionner un type de contrat",
  }),
  duration: z.string().optional(),
  location: z.string().min(2, "La localisation est requise").max(100),
  remote: z.boolean().default(false),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
  missions: z.string().optional(),
  profile: z.string().optional(),
  benefits: z.string().optional(),
  educationLevel: z.string().min(1, "Le niveau d'études est requis"),
  experienceRequired: z.string().optional(),
  skills: z.array(z.string()).min(3, "Veuillez ajouter au moins 3 compétences"),
  languages: z.array(z.object({
    language: z.string().min(1),
    level: z.string().min(1),
  })).default([]) as z.ZodType<{ language: string; level: string }[]>,
  expirationDate: z.date({
    required_error: "La date d'expiration est requise",
  }).refine((date) => date > new Date(), {
    message: "La date d'expiration doit être dans le futur",
  }),
  autoClose: z.boolean().default(false),
  emailNotifications: z.boolean().default(true),
});

export type JobPostingFormData = z.infer<typeof jobPostingSchema>;
