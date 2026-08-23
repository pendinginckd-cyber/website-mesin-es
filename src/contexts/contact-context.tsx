"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ContactInfo } from "@/types/contact";
import { getContactInfo } from "@/lib/firestore/contact";

interface ContactContextType {
  contact: ContactInfo | null;
  loading: boolean;
  refreshContact: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContact = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContactInfo();
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return (
    <ContactContext.Provider value={{ contact, loading, refreshContact: fetchContact }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return context;
}
