import { useGetElectionSettings, useUpdateElectionSettings, useResetElection, getGetElectionSettingsQueryKey } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const settingsSchema = z.object({
  electionName: z.string().min(1, "Required"),
  schoolName: z.string().optional(),
  welcomeMessage: z.string().optional(),
  isVotingOpen: z.boolean(),
  electionEndDate: z.string().optional().nullable(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetElectionSettings();
  const updateMutation = useUpdateElectionSettings();
  const resetMutation = useResetElection();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      electionName: "",
      schoolName: "",
      welcomeMessage: "",
      isVotingOpen: false,
      electionEndDate: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        electionName: settings.electionName,
        schoolName: settings.schoolName || "",
        welcomeMessage: settings.welcomeMessage || "",
        isVotingOpen: settings.isVotingOpen,
        electionEndDate: settings.electionEndDate || "",
      });
    }
  }, [settings, form]);

  if (isLoading) return <LoadingScreen />;

  const onSubmit = (data: SettingsFormValues) => {
    const payload = {
      ...data,
      electionEndDate: data.electionEndDate ? new Date(data.electionEndDate).toISOString() : null,
    };
    
    updateMutation.mutate(
      { data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetElectionSettingsQueryKey() });
          toast({ title: "Settings updated successfully" });
        }
      }
    );
  };

  const handleReset = () => {
    if (confirm("DANGER: This will delete ALL votes and reset candidate counts to zero. Are you absolutely sure?")) {
      resetMutation.mutate(
        {},
        {
          onSuccess: () => {
            toast({ title: "Election reset successfully" });
            // Invalidate everything to refresh UI
            queryClient.invalidateQueries();
          }
        }
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-heading font-bold text-foreground">Election Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global platform parameters.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card border-white/10 bg-black/20">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic details displayed across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="electionName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Election Name</FormLabel>
                        <FormControl><Input {...field} className="bg-black/20 border-white/10" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="schoolName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>School/Organization Name</FormLabel>
                        <FormControl><Input {...field} className="bg-black/20 border-white/10" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  
                  <FormField control={form.control} name="welcomeMessage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Message</FormLabel>
                      <FormControl><Textarea {...field} className="bg-black/20 border-white/10 min-h-[100px]" /></FormControl>
                      <FormDescription>Displayed on the landing page.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="pt-4 border-t border-white/10 space-y-6">
                    <h3 className="font-heading font-medium text-lg">Voting Control</h3>
                    
                    <FormField control={form.control} name="isVotingOpen" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Accept Votes</FormLabel>
                          <FormDescription>Toggle whether students can submit votes right now.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="electionEndDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-black/20 border-white/10" 
                          />
                        </FormControl>
                        <FormDescription>Used for the countdown timer. Does not automatically close polls.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Button type="submit" form="settings-form" className="w-full sm:w-auto bg-primary hover:bg-primary/90 rounded-xl" disabled={updateMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" /> 
                    {updateMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-red-500/30 bg-red-950/10">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Resetting the election will permanently delete all votes and set candidate vote counts back to zero. Students will be marked as not having voted.
              </p>
              <Button onClick={handleReset} variant="destructive" className="w-full rounded-xl" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? "Resetting..." : "Reset Election Data"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
