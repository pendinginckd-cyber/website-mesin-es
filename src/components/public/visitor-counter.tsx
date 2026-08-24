"use client";

import { useEffect } from "react";
import { incrementVisitorCount } from "@/lib/firestore/visitor-stats";

export function VisitorCounter() {
  useEffect(() => {
    incrementVisitorCount();
  }, []);

  return null;
}
