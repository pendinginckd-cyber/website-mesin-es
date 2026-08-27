"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Snowflake,
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  HelpCircle,
  Video,
  Image,
  Megaphone,
  Users,
  Phone,
  Building2,
  Truck,
  Eye,
  Wrench,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/produk", icon: Package, label: "Produk" },
  { href: "/admin/sparepart", icon: Wrench, label: "Sparepart" },
  { href: "/admin/artikel", icon: FileText, label: "Artikel" },
  { href: "/admin/testimoni", icon: MessageSquare, label: "Testimoni" },
  { href: "/admin/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/admin/video", icon: Video, label: "Video" },
  { href: "/admin/galeri", icon: Image, label: "Galeri" },
  { href: "/admin/banner", icon: Megaphone, label: "Banner" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { href: "/admin/tentang", icon: Building2, label: "Tentang" },
  { href: "/admin/keunggulan", icon: Truck, label: "Keunggulan" },
  { href: "/admin/visitor-stats", icon: Eye, label: "Visitor Stats" },
  { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/admin/kontak", icon: Phone, label: "Kontak" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
        <Snowflake className="w-6 h-6 text-primary" />
        <span className="font-bold">Admin Panel</span>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-800">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Kembali ke Website
        </Link>
      </div>
    </aside>
  );
}
