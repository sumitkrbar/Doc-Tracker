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
  const [sortBy, setSortBy] = useState(null); // 'owner' | 'cf' | 'np' | 'auth'
  const [sortOrder, setSortOrder] = useState("asc");

  

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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedDocuments = (() => {
    if (!displayedDocuments) return [];
    const docs = [...displayedDocuments];
    if (!sortBy) return docs;

    const getValue = (d) => {
      if (sortBy === "owner") return (d.owner || "").toLowerCase();
      if (sortBy === "cf") return d.cf ? new Date(d.cf).getTime() : null;
      if (sortBy === "np") return d.np ? new Date(d.np).getTime() : null;
      if (sortBy === "auth") return d.auth ? new Date(d.auth).getTime() : null;
      return null;
    };

    docs.sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);

      // Handle null/undefined dates: push them to the end
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;

      if (typeof va === "string" && typeof vb === "string") {
        return sortOrder === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }

      if (typeof va === "number" && typeof vb === "number") {
        return sortOrder === "asc" ? va - vb : vb - va;
      }

      return 0;
    });

    return docs;
  })();

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

        <div className="mb-3 flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground mr-auto">Sort by:</span>
          <Button
            size="sm"
            variant={sortBy === null && documentsMode === "recent" ? "default" : "outline"}
            onClick={() => {
              setSortBy(null);
              setSortOrder("asc");
              setDisplayedDocuments(getAllDocuments());
            }}
          >
            Latest
          </Button>
          <Button size="sm" variant={sortBy === "owner" ? "default" : "outline"} onClick={() => handleSort("owner")}>Name {sortBy === "owner" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</Button>
          <Button size="sm" variant={sortBy === "cf" ? "default" : "outline"} onClick={() => handleSort("cf")}>CF {sortBy === "cf" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</Button>
          <Button size="sm" variant={sortBy === "np" ? "default" : "outline"} onClick={() => handleSort("np")}>NP {sortBy === "np" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</Button>
          <Button size="sm" variant={sortBy === "auth" ? "default" : "outline"} onClick={() => handleSort("auth")}>Auth {sortBy === "auth" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</Button>
        </div>

        <DocumentTable documents={sortedDocuments} loading={documentsLoading} />
      </main>

      <AddDocumentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Dashboard;
