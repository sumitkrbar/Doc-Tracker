import { Button } from "@/components/ui/button";
import { FileText, Filter, Plus, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          DocuTrack Pro
        </h1>
        <Link to="/auth">
          <Button>Get Started</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground">
            <FileText className="h-4 w-4" />
            Document Management System
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground">
            Manage Your Documents
            <span className="block text-primary mt-2">Simply & Securely</span>
          </h1>

          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful platform to store, organize, and access your documents with advanced filtering capabilities.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                <Lock className="h-5 w-5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Add Documents</h3>
            <p className="text-muted-foreground">
              Easily upload and organize your documents with metadata
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Smart Filtering</h3>
            <p className="text-muted-foreground">
              Find documents quickly with powerful search and filters
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">View All</h3>
            <p className="text-muted-foreground">
              Access all your documents in one organized view
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
