import { AuthShell } from "@/components/admin/auth-shell";
import { NewPasswordForm } from "@/components/admin/auth-form";

export default function NewPasswordPage() {
  return (
    <AuthShell
      title="Nueva contraseña"
      description="Elige una contraseña larga que no utilices en otros sitios."
    >
      <NewPasswordForm />
    </AuthShell>
  );
}
