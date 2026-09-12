import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, LogIn, Loader2 } from "lucide-react";

interface LoginField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

interface LoginFormProps {
  title: string;
  subtitle: string;
  fields: LoginField[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export function LoginForm({ title, subtitle, fields, submitLabel, onSubmit }: LoginFormProps) {
  const [, navigate] = useLocation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Navigation is handled by the caller via redirectTo
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      <AnimatedBackground />

      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl bg-background/60">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                <Crown className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium text-muted-foreground">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                    className="bg-black/20 border-white/10 h-11"
                    disabled={isSubmitting}
                  />
                </div>
              ))}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
                {isSubmitting ? "Signing in..." : submitLabel}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}