"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

interface CopyLinkProps {
  url?: string;
  className?: string;
}

export function CopyLink({ url, className = "" }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const linkToCopy = url || window.location.href;
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors tap-effect ${className}`}
      title="Salin link produk"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Link disalin!</span>
        </>
      ) : (
        <>
          <Link2 className="w-4 h-4" />
          <span>Salin Link</span>
        </>
      )}
    </button>
  );
}
