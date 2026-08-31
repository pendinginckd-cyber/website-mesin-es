import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FaqList } from "@/components/public/faq-list";
import { FaqJsonLd } from "@/components/shared/faq-jsonld";
import { getFaqs } from "@/lib/firestore/faqs";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `FAQ - Pertanyaan yang Sering Diajukan | ${SITE_NAME}`,
  description: "Temukan jawaban untuk pertanyaan umum tentang mesin es kristal, layanan, dan teknis.",
};

export default async function FaqPage() {
  const faqs = await getFaqs({ isActive: true });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "FAQ" },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-gray-600">
          Temukan jawaban untuk pertanyaan umum tentang mesin es kristal, layanan, dan teknis.
        </p>
      </div>

      <FaqList faqs={faqs} />

      <FaqJsonLd faqs={faqs} />
    </div>
  );
}