import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login-form";

export default function StudentLogin() {
  const { studentLogin } = useAuth();
  const [, navigate] = useLocation();

  return (
    <LoginForm
      title="Student Login"
      subtitle="Sign in with your student ID and password to cast your vote."
      fields={[
        { name: "studentId", label: "Student ID", placeholder: "e.g. STU-2026-001", autoComplete: "username" },
        { name: "password", label: "Password", type: "password", placeholder: "Enter your password", autoComplete: "current-password" },
      ]}
      submitLabel="Sign In"
      onSubmit={async (values) => {
        await studentLogin({ studentId: values.studentId.trim(), password: values.password });
        navigate("/dashboard");
      }}
    />
  );
}