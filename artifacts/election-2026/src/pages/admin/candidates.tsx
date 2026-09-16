import { useState } from "react";
import { useGetCandidates, useCreateCandidate, useUpdateCandidate, useDeleteCandidate } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCandidatesQueryKey } from "@workspace/api-client-react";

const candidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["head_boy", "head_girl"]),
  className: z.string().min(1, "Class is required"),
  photoUrl: z.string().optional(),
  bio: z.string().min(1, "Bio is required"),
  promises: z.string().transform(str => str.split('\n').filter(p => p.trim() !== '')),
  color: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

export default function AdminCandidates() {
  const { data: candidates, isLoading } = useGetCandidates();
  const createMutation = useCreateCandidate();
  const updateMutation = useUpdateCandidate();
  const deleteMutation = useDeleteCandidate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      role: "head_boy",
      className: "",
      photoUrl: "",
      bio: "",
      promises: [] as unknown as string, // will be handled by string input
      color: "",
    },
  });

  if (isLoading) return <LoadingScreen />;

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({
      name: "",
      role: "head_boy",
      className: "",
      photoUrl: "",
      bio: "",
      promises: [] as unknown as string,
      color: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (candidate: any) => {
    setEditingId(candidate.id);
    form.reset({
      name: candidate.name,
      role: candidate.role,
      className: candidate.className,
      photoUrl: candidate.photoUrl || "",
      bio: candidate.bio,
      promises: candidate.promises.join('\n') as unknown as string,
      color: candidate.color || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this candidate?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetCandidatesQueryKey() });
            toast({ title: "Candidate deleted" });
          }
        }
      );
    }
  };

  const onSubmit = (data: CandidateFormValues) => {
    const payload = {
      ...data,
      promises: Array.isArray(data.promises) ? data.promises : [],
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetCandidatesQueryKey() });
            setIsDialogOpen(false);
            toast({ title: "Candidate updated" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: payload as any },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetCandidatesQueryKey() });
            setIsDialogOpen(false);
            toast({ title: "Candidate created" });
          }
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">Manage election candidates.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Candidate
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates?.map((candidate) => (
              <TableRow key={candidate.id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                      {candidate.photoUrl && <img src={candidate.photoUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-md text-xs ${candidate.role === 'head_boy' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                    {candidate.role === 'head_boy' ? 'Head Boy' : 'Head Girl'}
                  </span>
                </TableCell>
                <TableCell>{candidate.className}</TableCell>
                <TableCell>{candidate.voteCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(candidate)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(candidate.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {candidates?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No candidates found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">{editingId ? "Edit Candidate" : "Add Candidate"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} className="bg-black/20 border-white/10" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-white/10">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="head_boy">Head Boy</SelectItem>
                        <SelectItem value="head_girl">Head Girl</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="className" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl><Input {...field} className="bg-black/20 border-white/10" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="photoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL (Optional)</FormLabel>
                    <FormControl><Input {...field} className="bg-black/20 border-white/10" placeholder="https://..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl><Textarea {...field} className="bg-black/20 border-white/10 min-h-[100px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="promises" render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Promises (One per line)</FormLabel>
                  <FormControl><Textarea {...field} className="bg-black/20 border-white/10 min-h-[100px]" placeholder="More pizza in canteen&#10;Better wifi" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Candidate"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
