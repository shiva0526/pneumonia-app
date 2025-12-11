import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { authApi, User } from "@/api/authApi";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // On mount, check if user is already logged in by calling /me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (error) {
        // If 401, simply means not logged in
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await authApi.login(email, password);
      // After successful login, fetch user details
      const userData = await authApi.getMe();
      setUser(userData);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      return { error: null };
    } catch (err: any) {
      const message = err.response?.data?.detail || "Login failed";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      return { error: message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await authApi.register(email, password);
      // After register, you might be logged in automatically (depending on backend)
      // If backend sets cookies on register (which yours does), fetch user:
      const userData = await authApi.getMe();
      setUser(userData);

      toast({
        title: "Account Created!",
        description: "You have successfully signed up.",
      });
      return { error: null };
    } catch (err: any) {
      const message = err.response?.data?.detail || "Registration failed";
      toast({
        title: "Sign Up Failed",
        description: message,
        variant: "destructive",
      });
      return { error: message };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        signIn, 
        signUp, 
        signOut, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};