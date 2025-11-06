import { Button } from "@/components/ui/button";
import { FileText, Filter, Plus, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <h1
          className="text-2xl font-extrabold text-blue-600 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate("/")}
        >
          DocuTrack Pro
        </h1>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
        >
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-600">
            <FileText className="h-4 w-4" />
            Document Management System
          </div>

          <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Manage Your Documents
            <span className="block text-blue-600 mt-2">Simply & Securely</span>
          </h1>

          <p className="mb-10 text-lg text-slate-500 max-w-3xl mx-auto">
            A powerful platform to store, organize, and access your documents with advanced filtering capabilities.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            >
              <Lock className="h-5 w-5" />
              Get Started
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="h-14 w-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900">Add Documents</h3>
            <p className="text-slate-500">
              Easily upload and organize your documents with metadata
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="h-14 w-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900">Smart Filtering</h3>
            <p className="text-slate-500">
              Find documents quickly with powerful search and filters
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="h-14 w-14 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900">View All</h3>
            <p className="text-slate-500">
              Access all your documents in one organized view
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
