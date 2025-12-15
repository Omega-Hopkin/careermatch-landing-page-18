import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer un email valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  role: z.enum(["student", "recruiter"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const getPasswordStrength = (password: string): {
  strength: "weak" | "medium" | "strong";
  label: string;
  color: string;
  percentage: number;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { strength: "weak", label: "Faible", color: "bg-red-500", percentage: 33 };
  } else if (score <= 4) {
    return { strength: "medium", label: "Moyen", color: "bg-yellow-500", percentage: 66 };
  } else {
    return { strength: "strong", label: "Fort", color: "bg-green-500", percentage: 100 };
  }
};
