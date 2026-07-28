import { AuthShell } from "@/components/admin/auth-shell";
import { RecoveryForm } from "@/components/admin/auth-form";

export default function RecoverPasswordPage() {
  return (
    <AuthShell
      title="Recuperar acceso"
      description="Te enviaremos un enlace seguro para elegir una contraseña nueva."
    >
      <RecoveryForm />
    </AuthShell>
  );
}
