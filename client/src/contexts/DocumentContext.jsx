import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const DocumentContext = createContext(undefined);

export const DocumentProvider = ({ children }) => {
  
  const [documents, setDocuments] = useState([]);
  // mode indicates whether documents currently contains 'recent' (limited) or 'all'
  const [documentsMode, setDocumentsMode] = useState("recent"); // 'recent' | 'all'
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const { user } = useAuth();

  // Fetch recent documents (limit 5) when user logs in / changes
  useEffect(() => {
    const fetchRecent = async () => {
      if (!user) {
        setDocuments([]);
        return;
      }
      try {
        setDocumentsLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await api.get("/get-doc/recent", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          params: { limit: 5 },
        });

        if (data && data.success && Array.isArray(data.documents)) {
          const normalized = data.documents.map((d) => ({ ...d, id: d._id || d.id }));
          setDocuments(normalized);
          setDocumentsMode("recent");
        } else {
          setDocuments([]);
          setDocumentsMode("recent");
        }
      } catch (error) {
        console.error("fetchRecent error:", error);
        setDocuments([]);
      }
      finally {
        setDocumentsLoading(false);
      }
    };

    fetchRecent();
  }, [user]);

  // Refresh: fetch all documents from server (used when user clicks "Get All Documents")
  const refreshDocuments = async () => {
    if (!user) return [];
    setDocumentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/get-doc/all", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (data && data.success && Array.isArray(data.documents)) {
        const normalized = data.documents.map((d) => ({ ...d, id: d._id || d.id }));
        setDocuments(normalized);
        setDocumentsMode("all");
        return normalized;
      }
      return [];
    } catch (error) {
      console.error("refreshDocuments error:", error);
      return [];
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Fetch filtered documents from server using provided filters
  const fetchFilteredDocuments = async (filters) => {
    if (!user) return [];
    setDocumentsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.owner) params.owner = filters.owner;
      if (filters.vehicleNumber) params.vehicleNumber = filters.vehicleNumber;
      // Support explicit start/end ranges when provided, otherwise fall back
      if (filters.cfStart) params.cfStart = new Date(filters.cfStart).toISOString();
      if (filters.cfEnd) params.cfEnd = new Date(filters.cfEnd).toISOString();
      if (!filters.cfStart && !filters.cfEnd && filters.cfExpiry) {
        const d = new Date(filters.cfExpiry).toISOString();
        params.cfStart = d;
        params.cfEnd = d;
      }

      if (filters.npStart) params.npStart = new Date(filters.npStart).toISOString();
      if (filters.npEnd) params.npEnd = new Date(filters.npEnd).toISOString();
      if (!filters.npStart && !filters.npEnd && filters.npExpiry) {
        const d = new Date(filters.npExpiry).toISOString();
        params.npStart = d;
        params.npEnd = d;
      }

      if (filters.authStart) params.authStart = new Date(filters.authStart).toISOString();
      if (filters.authEnd) params.authEnd = new Date(filters.authEnd).toISOString();
      if (!filters.authStart && !filters.authEnd && filters.authExpiry) {
        const d = new Date(filters.authExpiry).toISOString();
        params.authStart = d;
        params.authEnd = d;
      }

      const { data } = await api.get("/get-doc/filter", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        params,
      });
      console.log("inside fucker");
      
      if (data && data.success && Array.isArray(data.documents)) {
        const normalized = data.documents.map((d) => ({ ...d, id: d._id || d.id }));
        // do not overwrite the global documents state here — just return results
        return normalized;
      }
      return [];
    } catch (error) {
      console.error("fetchFilteredDocuments error:", error);
      return [];
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Adds a document by calling the server and updating local state.
  // Returns the created document on success or throws on failure.
  const addDocument = async (document) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        owner: document.owner,
        phone: document.phone,
        vehicleNumber: document.vehicleNumber,
        cf: document.cf ? new Date(document.cf).toISOString() : undefined,
        np: document.np ? new Date(document.np).toISOString() : undefined,
        auth: document.auth ? new Date(document.auth).toISOString() : undefined,
        remarks: document.remarks,
      };

      const { data } = await api.post("/add-doc", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!data || !data.success) {
        throw new Error(data?.message || "Failed to add document");
      }

      // Server returns the newly created document; normalize and prepend to local list
      const serverDoc = data.document;
      const normalized = {
        ...serverDoc,
        id: serverDoc._id || serverDoc.id,
      };
      setDocuments((prev) => [normalized, ...prev]);
      return normalized;
    } catch (error) {
      console.error("addDocument error:", error);
      throw error;
    }
  };

  const getFilteredDocuments = (filters) => {
    return documents.filter(doc => {
      if (filters.owner && !doc.owner.toLowerCase().includes(filters.owner.toLowerCase())) {
        return false;
      }
      if (filters.vehicleNumber && !doc.vehicleNumber.toLowerCase().includes(filters.vehicleNumber.toLowerCase())) {
        return false;
      }
      if (filters.cfExpiry && doc.cf) {
        const cfDate = new Date(doc.cf);
        const filterDate = new Date(filters.cfExpiry);
        if (cfDate.toDateString() !== filterDate.toDateString()) {
          return false;
        }
      }
      if (filters.npExpiry && doc.np) {
        const npDate = new Date(doc.np);
        const filterDate = new Date(filters.npExpiry);
        if (npDate.toDateString() !== filterDate.toDateString()) {
          return false;
        }
      }
      if (filters.authExpiry && doc.auth) {
        const authDate = new Date(doc.auth);
        const filterDate = new Date(filters.authExpiry);
        if (authDate.toDateString() !== filterDate.toDateString()) {
          return false;
        }
      }
      return true;
    });
  };

  const getAllDocuments = () => documents;

  return (
    <DocumentContext.Provider value={{ documents, addDocument, getAllDocuments, refreshDocuments, fetchFilteredDocuments, documentsMode, documentsLoading }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
