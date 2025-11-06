import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage on first render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // This effect ensures we stay in sync with localStorage and handles 
  // page visibility changes (e.g., laptop lid close/open)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check localStorage when page becomes visible
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // If either is missing, clear both
          setUser(null);
          setToken(null);
        }
      }
    };

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Check auth state immediately
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  const login = async (email, password) => {
    try {
    const { data } = await api.post("/login", { email, password });
      
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
};


  const signup = async (email, password, name) => {
    try {
      const { data } = await api.post(`/register`, {username: name, email, password});
      if (!data.success) {
        throw new Error(data.message);
      }
      // Return email for OTP verification
      return data.email;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post('/verify-otp', { email, otp });
      if (data.success) {
        // Only set user and token after OTP verification
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        localStorage.setItem("token", data.token);
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout, isAuthenticated }}>
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
