import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useStudentLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatedBackground } from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function StudentLogin() {
  const [, setLocation] = useLocation();
  const { setStudentSession } = useAuth();
  const { toast } = useToast();
  const loginMutation = useStudentLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      studentId: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { data: { studentId: data.studentId } },
      {
        onSuccess: (session) => {
          setStudentSession(session);
          toast({
            title: "Authentication Successful",
            description: `Welcome back, ${session.student.name}`,
          });
          setLocation("/dashboard");
        },
        onError: (error: any) => {
          toast({
            title: "Authentication Failed",
            description: error.message || "Invalid Student ID",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      <AnimatedBackground />
      
      <div className="absolute top-6 left-6 z-20">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full">
          <Link href="/">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
            {/* Glowing orb behind the card content */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="mb-8 text-center relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">Student Access</h2>
              <p className="text-muted-foreground mt-2">Enter your designated Student ID to proceed</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Student ID Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <Input 
                            placeholder="e.g. STU-2026-001" 
                            {...field} 
                            className="h-14 pl-10 bg-black/20 border-white/10 text-lg rounded-xl focus-visible:ring-primary focus-visible:border-primary/50 transition-all"
                            autoComplete="off"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  {loginMutation.isPending ? "Authenticating..." : "Authenticate"}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
