import { createContext, useContext, useState } from "react";

const DocumentContext = createContext(undefined);

export const DocumentProvider = ({ children }) => {
  
  const [documents, setDocuments] = useState([]);

  const addDocument = (document) => {
    const newDocument = {
      ...document,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDocuments(prev => [newDocument, ...prev]);
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
    <DocumentContext.Provider value={{ documents, addDocument, getFilteredDocuments, getAllDocuments }}>
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
