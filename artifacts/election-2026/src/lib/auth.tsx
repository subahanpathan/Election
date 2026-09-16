import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StudentSession } from "@workspace/api-client-react/src/generated/api.schemas";

interface AuthState {
  student: StudentSession['student'] | null;
  studentToken: string | null;
  hasVoted: boolean;
  adminToken: string | null;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  setStudentSession: (session: StudentSession) => void;
  setAdminSession: (token: string) => void;
  setHasVoted: (hasVoted: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem("election-auth");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse auth state", e);
    }
    return {
      student: null,
      studentToken: null,
      hasVoted: false,
      adminToken: null,
      isAdmin: false,
    };
  });

  useEffect(() => {
    localStorage.setItem("election-auth", JSON.stringify(state));
  }, [state]);

  const setStudentSession = (session: StudentSession) => {
    setState((prev) => ({
      ...prev,
      student: session.student,
      studentToken: session.token,
      hasVoted: session.hasVoted ?? false,
    }));
  };

  const setAdminSession = (token: string) => {
    setState((prev) => ({
      ...prev,
      adminToken: token,
      isAdmin: true,
    }));
  };

  const setHasVoted = (hasVoted: boolean) => {
    setState((prev) => ({ ...prev, hasVoted }));
  };

  const logout = () => {
    setState({
      student: null,
      studentToken: null,
      hasVoted: false,
      adminToken: null,
      isAdmin: false,
    });
    localStorage.removeItem("election-auth");
  };

  return (
    <AuthContext.Provider
      value={{ ...state, setStudentSession, setAdminSession, setHasVoted, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
