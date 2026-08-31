"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useContact } from "@/contexts/contact-context";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";
import { QUICK_REPLIES, buildWhatsAppUrl } from "@/lib/whatsapp-widget";

export function WhatsAppChatWidget() {
  const { contact } = useContact();
  const waNumber = contact?.whatsappNumber || WHATSAPP_NUMBER;
  const waMessage = contact?.whatsappMessage || WHATSAPP_MESSAGE;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function openWhatsApp(message: string) {
    window.open(buildWhatsAppUrl(waNumber, message), "_blank", "noopener,noreferrer");
    setOpen(false);
    setInput("");
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim() || waMessage;
    if (!message) return;
    openWhatsApp(message);
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[330px] sm:w-[360px] max-h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-3 fade-in duration-200">
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-green-600 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">Mesin Es Kristal</p>
              <p className="text-xs text-green-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                Tim sales online — balas dalam beberapa menit
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Tutup chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 px-4 py-4 bg-gray-50 flex flex-col gap-3 overflow-y-auto">
            <div className="max-w-[85%] bg-white rounded-xl rounded-tl-sm border border-gray-200 px-3 py-2.5 text-sm text-gray-800 shadow-sm">
              <p className="flex items-center gap-1.5 font-medium text-gray-900 text-[13px]">
                <Sparkles className="w-3.5 h-3.5 text-green-600" />
                Halo! Selamat datang di Mesin Es Kristal
              </p>
              <p className="mt-1 text-[13px]">{waMessage}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">
                Pilih topik:
              </p>
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.label}
                  type="button"
                  onClick={() => openWhatsApp(reply.message)}
                  className="text-left flex items-center justify-between gap-2 bg-white border border-green-200 hover:border-green-500 hover:bg-green-50 text-gray-800 text-[13px] font-medium rounded-xl px-3 py-2.5 transition-colors tap-effect"
                >
                  {reply.label}
                  <span className="text-green-600 text-xs">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 p-2.5 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 border border-gray-300 rounded-full px-3.5 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              className="shrink-0 w-9 h-9 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors tap-effect"
              aria-label="Kirim via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label={open ? "Tutup chat WhatsApp" : "Chat WhatsApp"}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {open ? "Tutup" : "Chat via WhatsApp"}
        </span>
      </button>
    </div>
  );
}