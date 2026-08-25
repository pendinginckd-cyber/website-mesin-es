"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, Trash2, Package, Newspaper, Video } from "lucide-react";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useSearchContent } from "@/hooks/use-search-content";

interface ProdukSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValue?: string;
  onSearch: (query: string) => void;
  fullWidth?: boolean;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-primary">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function ProdukSearchDropdown({ isOpen, onClose, defaultValue, onSearch, fullWidth }: ProdukSearchDropdownProps) {
  const [value, setValue] = useState(defaultValue || "");
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { products, articles, videos, loaded } = useSearchContent(isOpen);

  // Animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const query = value.trim().toLowerCase();

  const productSuggestions = useMemo(() => {
    if (!query) return [];
    return products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 4);
  }, [query, products]);

  const articleSuggestions = useMemo(() => {
    if (!query) return [];
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query))
      )
      .slice(0, 4);
  }, [query, articles]);

  const videoSuggestions = useMemo(() => {
    if (!query) return [];
    return videos
      .filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query)
      )
      .slice(0, 4);
  }, [query, videos]);

  const hasResults =
    productSuggestions.length > 0 ||
    articleSuggestions.length > 0 ||
    videoSuggestions.length > 0;

  function commitSearch(rawQuery: string) {
    const q = rawQuery.trim();
    if (!q) return;
    setValue(q);
    addToHistory(q);
    onSearch(q);
    onClose();
  }

  function openDetail(href: string) {
    if (!value.trim()) return;
    addToHistory(value.trim());
    router.push(href);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`${fullWidth ? "w-full" : "w-[28rem] max-w-[calc(100vw-3rem)]"} transition-all duration-200 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitSearch(value);
          }}
          placeholder="Cari produk, artikel, video..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none focus:bg-gray-200 transition-colors placeholder:text-gray-400"
        />
      </div>

      {/* Live Suggestions */}
      {query && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {!loaded ? (
            <div className="px-3 py-3 text-sm text-gray-500">Memuat saran...</div>
          ) : !hasResults ? (
            <div className="px-3 py-3 text-sm text-gray-500">
              Tidak ada hasil untuk &quot;{value.trim()}&quot;
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {/* Products */}
              {productSuggestions.length > 0 && (
                <div>
                  <SectionHeader icon={<Package className="w-3.5 h-3.5" />} label="Produk" />
                  <ul>
                    {productSuggestions.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => openDetail(`/produk/${product.slug}`)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {product.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 truncate">
                            <HighlightMatch text={product.name} query={value.trim()} />
                          </p>
                          <p className="text-xs text-gray-400 truncate">{product.category}</p>
                        </div>
                        <span className="ml-auto shrink-0 text-xs font-semibold text-primary">
                          {product.priceDisplay}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Articles */}
              {articleSuggestions.length > 0 && (
                <div>
                  <SectionHeader icon={<Newspaper className="w-3.5 h-3.5" />} label="Artikel" />
                  <ul>
                    {articleSuggestions.map((article) => (
                      <li
                        key={article.id}
                        onClick={() => openDetail(`/artikel/${article.slug}`)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {article.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center shrink-0">
                            <Newspaper className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 truncate">
                            <HighlightMatch text={article.title} query={value.trim()} />
                          </p>
                          <p className="text-xs text-gray-400 truncate">Artikel · {article.category}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Videos */}
              {videoSuggestions.length > 0 && (
                <div>
                  <SectionHeader icon={<Video className="w-3.5 h-3.5" />} label="Video" />
                  <ul>
                    {videoSuggestions.map((video) => (
                      <li
                        key={video.id}
                        onClick={() => openDetail(`/video/${video.id}`)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-9 h-9 rounded object-cover border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800 truncate">
                            <HighlightMatch text={video.title} query={value.trim()} />
                          </p>
                          <p className="text-xs text-gray-400 truncate">Video · {video.category}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search History (only when input empty) */}
      {!query && history.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Riwayat Pencarian</span>
            </div>
            <button
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer group"
                onClick={() => commitSearch(item)}
              >
                <span className="text-sm text-gray-700 truncate">{item}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(item);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
