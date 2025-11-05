import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { set } from "date-fns";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);


  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/login", { email, password });
      
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
    
    try{
      const { data } = await axios.post(`http://localhost:5000/api/register`, {username: name, email, password})

      if(data.success){
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          setToken(data.token);
          localStorage.setItem("token", data.token);
      } else{
          toast.error(data.message)
      }
    }catch(error){
          toast.error(error.message)
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
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
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
