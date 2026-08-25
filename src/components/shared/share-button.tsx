"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, MessageCircle, Send, Link2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  message?: string;
  imageUrl?: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, message, imageUrl, url, className = "" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open]);

  async function copyToClipboard(value: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        // fall through to legacy method
      }
    }
    // Legacy fallback for insecure contexts (e.g. http over LAN)
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }

  async function handleCopy() {
    const ok = await copyToClipboard(url || window.location.href);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleShareClick() {
    const shareUrl = url || window.location.href;
    const shareText = message || (text ? `${title} - ${text}` : title);

    // 1) Try native share including product image file
    if (typeof navigator !== "undefined" && navigator.share && imageUrl) {
      try {
        const resp = await fetch(imageUrl);
        if (resp.ok) {
          const blob = await resp.blob();
          const ext = blob.type.split("/")[1] || "jpg";
          const safeName =
            title.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() ||
            "produk";
          const file = new File([blob], `${safeName}.${ext}`, { type: blob.type });
          if (!navigator.canShare || navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title,
              text: `${shareText}\n\n${shareUrl}`,
            });
            return;
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        // fall through to URL-only share
      }
    }

    // 2) Native share (URL)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }

    // 3) Desktop popover fallback
    setOpen((v) => !v);
  }

  const shareUrl = url || window.location.href;
  const shareText = message || (text ? `${title} - ${text}` : title);

  const channels = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      icon: <MessageCircle className="w-4 h-4 text-green-600" />,
      chip: "bg-green-100",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: <span className="text-blue-600 font-bold text-sm leading-none">f</span>,
      chip: "bg-blue-100",
    },
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      icon: <span className="text-gray-900 font-bold text-xs leading-none">𝕏</span>,
      chip: "bg-gray-100",
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: <Send className="w-4 h-4 text-sky-500" />,
      chip: "bg-sky-100",
    },
  ];

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <button
        onClick={handleShareClick}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors tap-effect"
        aria-label={`Bagikan ${title}`}
        title={`Bagikan ${title}`}
      >
        <Share2 className="w-4 h-4" />
        <span>Bagikan</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <span className={`w-7 h-7 rounded-full ${channel.chip} flex items-center justify-center shrink-0`}>
                {channel.icon}
              </span>
              <span className="text-sm text-gray-700">{channel.label}</span>
            </a>
          ))}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4 text-gray-500" />}
            </span>
            <span className={`text-sm ${copied ? "text-green-600" : "text-gray-700"}`}>
              {copied ? "Tersalin!" : "Salin Link"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
