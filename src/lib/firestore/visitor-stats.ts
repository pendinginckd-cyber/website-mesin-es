import {
  doc,
  getDoc,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { VisitorStats } from "@/types/visitor-stats";

const VISITOR_STATS_DOC_ID = "default";

export async function getVisitorStats(): Promise<VisitorStats> {
  if (!db) return getDefaultVisitorStats();

  try {
    const docRef = doc(db, "visitorStats", VISITOR_STATS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        dailyVisitors: data.dailyVisitors || 0,
        yearlyVisitors: data.yearlyVisitors || 0,
        totalVisitors: data.totalVisitors || 0,
        baseDaily: data.baseDaily || 0,
        baseYearly: data.baseYearly || 0,
        baseTotal: data.baseTotal || 0,
        lastResetDate: data.lastResetDate || "",
        lastYearReset: data.lastYearReset || "",
      };
    }
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
  }

  return getDefaultVisitorStats();
}

export async function incrementVisitorCount(): Promise<void> {
  if (!db) return;

  // Check localStorage to prevent double counting per day
  const today = new Date().toISOString().split("T")[0];
  const countedKey = `visitor_counted_${today}`;
  if (localStorage.getItem(countedKey)) return;

  try {
    const docRef = doc(db, "visitorStats", VISITOR_STATS_DOC_ID);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentYear = now.getFullYear().toString();

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);

      if (!docSnap.exists()) {
        // Initialize with default values
        transaction.set(docRef, {
          dailyVisitors: 1,
          yearlyVisitors: 1,
          totalVisitors: 1,
          baseDaily: 0,
          baseYearly: 0,
          baseTotal: 0,
          lastResetDate: todayStr,
          lastYearReset: currentYear,
        });
        return;
      }

      const data = docSnap.data();
      let dailyVisitors = data.dailyVisitors || 0;
      let yearlyVisitors = data.yearlyVisitors || 0;
      let totalVisitors = data.totalVisitors || 0;
      let lastResetDate = data.lastResetDate || "";
      let lastYearReset = data.lastYearReset || "";
      const baseDaily = data.baseDaily || 0;
      const baseYearly = data.baseYearly || 0;

      // Reset daily if date changed
      if (lastResetDate !== todayStr) {
        dailyVisitors = baseDaily + 1;
        lastResetDate = todayStr;
      } else {
        dailyVisitors += 1;
      }

      // Reset yearly if year changed
      if (lastYearReset !== currentYear) {
        yearlyVisitors = baseYearly + 1;
        lastYearReset = currentYear;
      } else {
        yearlyVisitors += 1;
      }

      totalVisitors += 1;

      transaction.update(docRef, {
        dailyVisitors,
        yearlyVisitors,
        totalVisitors,
        lastResetDate,
        lastYearReset,
      });
    });

    // Mark as counted for today
    localStorage.setItem(countedKey, "true");
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
  }
}

export async function updateVisitorBase(data: {
  baseDaily?: number;
  baseYearly?: number;
  baseTotal?: number;
}): Promise<void> {
  if (!db) throw new Error("Firestore not configured");

  const docRef = doc(db, "visitorStats", VISITOR_STATS_DOC_ID);

  // Transaksional agar tidak menimpa increment pengunjung yang terjadi bersamaan
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(docRef);
    const current = snap.exists()
      ? (snap.data() as Partial<VisitorStats>)
      : getDefaultVisitorStats();

    const curDaily = current.dailyVisitors || 0;
    const curYearly = current.yearlyVisitors || 0;
    const curTotal = current.totalVisitors || 0;

    const updates: Record<string, number | string | Timestamp> = {};

    if (data.baseDaily !== undefined) {
      const diff = data.baseDaily - (current.baseDaily || 0);
      updates.dailyVisitors = curDaily + diff;
      updates.baseDaily = data.baseDaily;
    }

    if (data.baseYearly !== undefined) {
      const diff = data.baseYearly - (current.baseYearly || 0);
      updates.yearlyVisitors = curYearly + diff;
      updates.baseYearly = data.baseYearly;
    }

    if (data.baseTotal !== undefined) {
      const diff = data.baseTotal - (current.baseTotal || 0);
      updates.totalVisitors = curTotal + diff;
      updates.baseTotal = data.baseTotal;
    }

    updates.updatedAt = Timestamp.now();
    tx.set(docRef, updates, { merge: true });
  });
}

function getDefaultVisitorStats(): VisitorStats {
  return {
    id: VISITOR_STATS_DOC_ID,
    dailyVisitors: 0,
    yearlyVisitors: 0,
    totalVisitors: 0,
    baseDaily: 0,
    baseYearly: 0,
    baseTotal: 0,
    lastResetDate: "",
    lastYearReset: "",
  };
}
