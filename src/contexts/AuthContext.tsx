
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserData {
  user_id?: number;
  user_level_id?: number;
  skpd_name?: string;
  skpd_generate?: string;
  user_spesimen?: string | null;
  nik?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user_username?: string;
  user_status?: string;
  user_check?: string;
  token?: string | null;
  user_kepala_daerah?: string;
  user_create_date?: string;
  email?: string; // Keep for backward compatibility
}

interface User {
  email: string;
  token?: string;
  userData?: UserData;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for authentication status on component mount
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://ttd.lombokutarakab.go.id/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();
      
      if (!response.ok || data.status === false) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }
      
      // Handle the new response format
      const userData = data.data;
      const token = data.token;
      
      // Create user object with both old and new structure
      const userObject = {
        email: userData?.user_email || credentials.email,
        token: token,
        userData: userData
      };
      
      setIsAuthenticated(true);
      setUser(userObject);
      
      // Store authentication in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userObject));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
