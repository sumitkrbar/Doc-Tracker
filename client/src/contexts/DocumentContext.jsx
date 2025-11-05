import { createContext, useContext, useState } from "react";

const DocumentContext = createContext(undefined);

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([
    {
      id: "1",
      owner: "John Doe",
      phone: 9876543210,
      vehicleNumber: "ABC-1234",
      cf: new Date("2024-12-31"),
      np: new Date("2024-11-30"),
      auth: new Date("2025-11-15"),
      remarks: "Regular maintenance required",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      owner: "Jane Smith",
      phone: 9123456789,
      vehicleNumber: "XYZ-5678",
      cf: new Date("2024-11-20"),
      np: new Date("2024-12-15"),
      auth: new Date("2025-02-01"),
      remarks: "New vehicle",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
    },
  ]);

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
