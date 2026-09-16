import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAdminLogin } from "@workspace/api-client-react";
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
import { ArrowLeft, ShieldAlert, Key } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { setAdminSession } = useAuth();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (session) => {
          setAdminSession(session.token);
          toast({
            title: "Access Granted",
            description: "Welcome to the Admin Portal",
          });
          setLocation("/admin/dashboard");
        },
        onError: (error: any) => {
          toast({
            title: "Access Denied",
            description: error.message || "Invalid credentials",
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
          <div className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden border-accent/20">
            {/* Glowing orb behind the card content */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="mb-8 text-center relative z-10">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <ShieldAlert className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">Admin Portal</h2>
              <p className="text-muted-foreground mt-2">Restricted area for election officials</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin" 
                          {...field} 
                          className="h-12 bg-black/20 border-white/10 rounded-xl focus-visible:ring-accent focus-visible:border-accent/50 transition-all"
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 uppercase text-xs tracking-wider">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Key className="w-4 h-4" />
                          </div>
                          <Input 
                            type="password"
                            placeholder="••••••••" 
                            {...field} 
                            className="h-12 pl-10 bg-black/20 border-white/10 rounded-xl focus-visible:ring-accent focus-visible:border-accent/50 transition-all"
                            autoComplete="current-password"
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
                  className="w-full h-14 text-lg rounded-xl mt-6 bg-accent hover:bg-accent/90 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {loginMutation.isPending ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
