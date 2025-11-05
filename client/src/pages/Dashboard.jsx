import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Filter, RefreshCw } from "lucide-react";
import DocumentTable from "@/components/DocumentTable";
import AddDocumentDialog from "@/components/AddDocumentDialog";
import FilterPanel from "@/components/FilterPanel";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getAllDocuments, getFilteredDocuments } = useDocuments();
  const navigate = useNavigate();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [displayedDocuments, setDisplayedDocuments] = useState(getAllDocuments());

  const handleLogout = () => {
    logout();
    // Use setTimeout to ensure navigation happens after state updates
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const handleGetAllDocuments = () => {
    setFilters({});
    setDisplayedDocuments(getAllDocuments());
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setDisplayedDocuments(getFilteredDocuments(newFilters));
  };

  const handleClearFilters = () => {
    setFilters({});
    setDisplayedDocuments(getAllDocuments());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Document Manager</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.username}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Documents</h2>
            <p className="text-sm text-muted-foreground">
              Manage your vehicle documentation records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>

            <Button onClick={handleGetAllDocuments} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Get All Documents
            </Button>

            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Document
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <FilterPanel
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        <DocumentTable documents={displayedDocuments} />
      </main>

      <AddDocumentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Dashboard;
