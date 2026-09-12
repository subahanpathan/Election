import React, { createContext, useContext, useMemo } from "react";
import {
  useGetStudentSession,
  useGetAdminSession,
  useStudentLogin,
  useAdminLogin,
  useStudentLogout,
  useAdminLogout,
  getGetStudentSessionQueryKey,
  getGetAdminSessionQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextValue {
  studentSession: { id: number; studentId: string; name: string; className: string; hasVoted: boolean; votedAt: string | null } | null | undefined;
  adminSession: { id: number; username: string; name: string } | null | undefined;
  studentLoading: boolean;
  adminLoading: boolean;
  studentLogin: (credentials: { studentId: string; password: string }) => Promise<void>;
  adminLogin: (credentials: { username: string; password: string }) => Promise<void>;
  studentLogout: () => Promise<void>;
  adminLogout: () => Promise<void>;
  refreshStudent: () => void;
  refreshAdmin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const studentQuery = useGetStudentSession<{ id: number; studentId: string; name: string; className: string; hasVoted: boolean; votedAt: string | null } | null>();
  const adminQuery = useGetAdminSession<{ id: number; username: string; name: string } | null>();

  const studentLoginMutation = useStudentLogin<void>();
  const adminLoginMutation = useAdminLogin<void>();
  const studentLogoutMutation = useStudentLogout();
  const adminLogoutMutation = useAdminLogout();

  const refreshStudent = () => queryClient.invalidateQueries({ queryKey: getGetStudentSessionQueryKey() });
  const refreshAdmin = () => queryClient.invalidateQueries({ queryKey: getGetAdminSessionQueryKey() });

  const value = useMemo<AuthContextValue>(
    () => ({
      studentSession: studentQuery.data ?? null,
      adminSession: adminQuery.data ?? null,
      studentLoading: studentQuery.isLoading,
      adminLoading: adminQuery.isLoading,
      studentLogin: async (credentials) => {
        await studentLoginMutation.mutateAsync({ data: credentials });
        refreshStudent();
      },
      adminLogin: async (credentials) => {
        await adminLoginMutation.mutateAsync({ data: credentials });
        refreshAdmin();
      },
      studentLogout: async () => {
        await studentLogoutMutation.mutateAsync();
        refreshStudent();
      },
      adminLogout: async () => {
        await adminLogoutMutation.mutateAsync();
        refreshAdmin();
      },
      refreshStudent,
      refreshAdmin,
    }),
    [studentQuery.data, adminQuery.data, studentQuery.isLoading, adminQuery.isLoading, studentLoginMutation, adminLoginMutation, studentLogoutMutation, adminLogoutMutation, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}