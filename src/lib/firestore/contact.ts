import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ContactInfo } from "@/types/contact";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
  decodeSafe,
} from "@/lib/constants";
import { normalizeWaPhone } from "@/lib/phone";

const CONTACT_DOC_ID = "default";

export async function getContactInfo(): Promise<ContactInfo> {
  if (!db) {
    return getDefaultContactInfo();
  }

  try {
    const docRef = doc(db, "contactInfo", CONTACT_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        // Lapisan defensif: nilai lama bisa berupa 08xx / +62 — rapikan saat baca
        whatsappNumber: data.whatsappNumber
          ? normalizeWaPhone(data.whatsappNumber)
          : WHATSAPP_NUMBER,
        // Nilai lama di Firestore tersimpan ter-encode (%20) — bersihkan
        whatsappMessage: decodeSafe(data.whatsappMessage) || WHATSAPP_MESSAGE,
        email: data.email || "",
        address: data.address || "",
        operatingHours: data.operatingHours || "",
        googleMapsEmbed: data.googleMapsEmbed || "",
        description: data.description || "",
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
  } catch (error) {
    console.error("Error fetching contact info:", error);
  }

  return getDefaultContactInfo();
}

export async function updateContactInfo(data: Partial<Omit<ContactInfo, "id" | "updatedAt">>): Promise<void> {
  if (!db) throw new Error("Firestore not configured");
  const docRef = doc(db, "contactInfo", CONTACT_DOC_ID);
  await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
}

function getDefaultContactInfo(): ContactInfo {
  return {
    id: CONTACT_DOC_ID,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappMessage: WHATSAPP_MESSAGE,
    email: "",
    address: "",
    operatingHours: "",
    googleMapsEmbed: "",
    description: "",
    updatedAt: new Date(),
  };
}
