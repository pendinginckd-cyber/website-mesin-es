"use client";

import { useState, useEffect } from "react";
import { getKeunggulanSettings, getKeunggulanItems } from "@/lib/firestore/keunggulan";
import { KeunggulanSettings, KeunggulanItem } from "@/types/keunggulan";
import { Star, Shield, Wrench, DollarSign, Truck, Headphones, Zap, Award, Users, Package, Heart, CheckCircle, Settings, Globe, Clock, Lightbulb, ShieldCheck, BarChart, Target, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  shield: Shield,
  wrench: Wrench,
  "dollar-sign": DollarSign,
  truck: Truck,
  headphones: Headphones,
  zap: Zap,
  award: Award,
  users: Users,
  package: Package,
  heart: Heart,
  "check-circle": CheckCircle,
  settings: Settings,
  globe: Globe,
  clock: Clock,
  lightbulb: Lightbulb,
  "shield-check": ShieldCheck,
  "bar-chart": BarChart,
  target: Target,
  "trending-up": TrendingUp,
};

export function KeunggulanSection() {
  const [settings, setSettings] = useState<KeunggulanSettings | null>(null);
  const [items, setItems] = useState<KeunggulanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsData, itemsData] = await Promise.all([
          getKeunggulanSettings(),
          getKeunggulanItems(),
        ]);
        setSettings(settingsData);
        setItems(itemsData.filter((i) => i.isActive));
      } catch (error) {
        console.error("Error fetching keunggulan:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {settings?.title || "Kenapa Pilih Mesin Es Kristal Kami?"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {settings?.subtitle || "Kami memberikan yang terbaik untuk setiap pelanggan dengan kualitas produk dan layanan purna jual yang terjamin."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || Star;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
