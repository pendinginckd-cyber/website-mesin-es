import Link from "next/link";
import { Snowflake, Home, Package } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Snowflake className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-2">Halaman Tidak Ditemukan</p>
        <p className="text-gray-500 mb-8">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors tap-effect"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/produk"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors tap-effect"
          >
            <Package className="w-5 h-5" />
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
