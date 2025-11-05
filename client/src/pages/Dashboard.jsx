import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Filter, RefreshCw } from "lucide-react";
import DocumentTable from "@/components/DocumentTable";
import AddDocumentDialog from "@/components/AddDocumentDialog";
import FilterPanel from "@/components/FilterPanel";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { documents, getAllDocuments, refreshDocuments, fetchFilteredDocuments, documentsMode, documentsLoading } = useDocuments();
  const navigate = useNavigate();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [displayedDocuments, setDisplayedDocuments] = useState([]);

  

  // Keep displayed documents in sync with the global documents.
  // When filters are active, re-apply them; otherwise show all documents.
  // Sync displayed documents with context documents only when no filters are active.
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setDisplayedDocuments(getAllDocuments());
    }
  }, [documents]);

  const handleLogout = () => {
    logout();
    // Use setTimeout to ensure navigation happens after state updates
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  const handleGetAllDocuments = async () => {
    setFilters({});
    const all = await refreshDocuments();
    setDisplayedDocuments(all);
  };

  const handleApplyFilters = async (newFilters) => {
    setFilters(newFilters);
    const results = await fetchFilteredDocuments(newFilters);
    setDisplayedDocuments(results);
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
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground">Documents</h2>
              {documentsMode === "recent" ? (
                <Badge className="bg-muted text-foreground">Showing recent</Badge>
              ) : (
                <Badge className="bg-muted text-foreground">Showing all</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Manage your vehicle documentation records</p>
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

  <DocumentTable documents={displayedDocuments} loading={documentsLoading} />
      </main>

      <AddDocumentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Dashboard;
