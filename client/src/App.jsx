import Index from './pages/Index.jsx'
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth.jsx";
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DocumentProvider } from "./contexts/DocumentContext";

function App() {

  return (
    <AuthProvider>
      <DocumentProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
      </BrowserRouter>
      </DocumentProvider>
    </AuthProvider>
    
  )
}

export default App
