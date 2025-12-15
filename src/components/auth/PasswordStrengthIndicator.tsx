import { getPasswordStrength } from "@/lib/validations/auth";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  if (!password) return null;

  const { label, color, percentage } = getPasswordStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Force du mot de passe</span>
        <span className={`font-medium ${
          percentage === 33 ? "text-red-500" : 
          percentage === 66 ? "text-yellow-500" : "text-green-500"
        }`}>
          {label}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
