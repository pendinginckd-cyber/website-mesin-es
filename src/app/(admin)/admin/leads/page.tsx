"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  subscribeLeads,
  updateLeadStatus,
  deleteLead,
  getLeads,
} from "@/lib/firestore/leads";
import { Lead } from "@/types/lead";
import { WHATSAPP_MESSAGE } from "@/lib/constants";
import {
  Trash2,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700", icon: Clock },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700", icon: Phone },
  converted: { label: "Converted", color: "bg-green-100 text-green-700", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-700", icon: XCircle },
};

function formatDate(date: Date): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Realtime: lead baru/status baru muncul otomatis tanpa reload
    const unsubscribe = subscribeLeads(
      (data) => {
        setLeads(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error subscribing leads:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: Lead["status"]) {
    try {
      await updateLeadStatus(id, status);
      fetchLeads();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal update status.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus lead ini?")) return;
    try {
      await deleteLead(id);
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Gagal menghapus.");
    }
  }

  function normalizePhone(phone: string): string {
    const digits = phone.replace(/[^0-9]/g, "");
    // wa.me mewajibkan format internasional tanpa awalan 0
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("0")) return "62" + digits.slice(1);
    if (digits.startsWith("8")) return "62" + digits;
    return digits;
  }

  async function openWhatsApp(lead: Lead) {
    const phone = normalizePhone(lead.phone);
    const message = `Halo ${lead.name}, terima kasih sudah menghubungi kami. ${WHATSAPP_MESSAGE}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    // Otomatis tandai Contacted jika masih New
    if (lead.status === "new") {
      try {
        await updateLeadStatus(lead.id, "contacted");
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, status: "contacted" as const } : l))
        );
      } catch (error) {
        console.error("Error auto-updating status:", error);
      }
    }
  }

  function getFiltered() {
    if (filterStatus === "all") return leads;
    return leads.filter((l) => l.status === filterStatus);
  }

  const filtered = getFiltered();
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Leads</h2>
        <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Leads</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          <p className="text-sm text-gray-500">New</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
          <p className="text-sm text-gray-500">Contacted</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
          <p className="text-sm text-gray-500">Converted</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
          <p className="text-sm text-gray-500">Closed</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filterStatus === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-300 hover:border-primary"
          }`}
        >
          Semua ({stats.total})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filterStatus === key
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:border-primary"
            }`}
          >
            {config.label} ({stats[key as keyof typeof stats]})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const statusConfig = STATUS_CONFIG[lead.status];
            const StatusIcon = statusConfig.icon;
            return (
              <Card key={lead.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusConfig.label}
                        </span>
                        {lead.productInterest && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {lead.productInterest}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span>{lead.email}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>
                      {!isExpanded && (
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => openWhatsApp(lead)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Chat WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Pesan:</p>
                          <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3">
                            {lead.message}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Status:</p>
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead["status"])}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                              ))}
                            </select>
                          </div>
                          {lead.productInterest && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Produk Diminati:</p>
                              <p className="text-sm text-gray-600">{lead.productInterest}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Sembunyikan detail
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Lihat detail
                      </>
                    )}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            Belum ada lead{filterStatus !== "all" ? ` dengan status "${filterStatus}"` : ""}.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Lead akan muncul ketika ada yang mengisi form kontak.
          </p>
        </div>
      )}
    </div>
  );
}
