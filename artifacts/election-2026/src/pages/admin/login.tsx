import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const [, navigate] = useLocation();

  return (
    <LoginForm
      title="Admin Login"
      subtitle="Authorized personnel only. Sign in to manage the election."
      fields={[
        { name: "username", label: "Username", placeholder: "Enter your username", autoComplete: "username" },
        { name: "password", label: "Password", type: "password", placeholder: "Enter your password", autoComplete: "current-password" },
      ]}
      submitLabel="Sign In"
      onSubmit={async (values) => {
        await adminLogin({ username: values.username.trim(), password: values.password });
        navigate("/admin/dashboard");
      }}
    />
  );
}