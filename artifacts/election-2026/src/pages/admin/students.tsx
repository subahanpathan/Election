import { useState } from "react";
import { useGetStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getGetStudentsQueryKey } from "@workspace/api-client-react";

const studentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  className: z.string().min(1, "Class is required"),
  password: z.string().min(4, "Password must be at least 4 characters").optional().or(z.literal("").optional()),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function AdminStudents() {
  const { data: students, isLoading } = useGetStudents();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: "",
      name: "",
      className: "",
      password: "",
    },
  });

  if (isLoading) return <LoadingScreen />;

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({ studentId: "", name: "", className: "", password: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (student: any) => {
    setEditingId(student.id);
    form.reset({
      studentId: student.studentId,
      name: student.name,
      className: student.className,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetStudentsQueryKey() });
            toast({ title: "Student deleted" });
          }
        }
      );
    }
  };

  const onSubmit = (data: StudentFormValues) => {
    const payload: any = {
      studentId: data.studentId,
      name: data.name,
      className: data.className,
    };
    if (data.password) payload.password = data.password;

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetStudentsQueryKey() });
            setIsDialogOpen(false);
            toast({ title: "Student updated" });
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetStudentsQueryKey() });
            setIsDialogOpen(false);
            toast({ title: "Student added" });
          }
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage eligible voters.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Student
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-mono text-muted-foreground">{student.studentId}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>
                  {student.hasVoted ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Voted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-muted-foreground">
                      <XCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(student)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {students?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">{editingId ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField control={form.control} name="studentId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl><Input {...field} className="bg-black/20 border-white/10 font-mono" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} className="bg-black/20 border-white/10" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="className" render={({ field }) => (
                <FormItem>
                  <FormLabel>Class/Grade</FormLabel>
                  <FormControl><Input {...field} className="bg-black/20 border-white/10" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>{editingId ? "New Password (optional)" : "Password"}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" autoComplete="new-password" placeholder={editingId ? "Leave blank to keep current password" : "Default: student ID"} className="bg-black/20 border-white/10" />
                  </FormControl>
                  {!editingId && <p className="text-xs text-muted-foreground">If left blank, the student ID is used as the default password.</p>}
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Student"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
