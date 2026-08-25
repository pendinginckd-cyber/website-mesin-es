import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactProvider } from "@/contexts/contact-context";
import { BackToTop } from "@/components/public/back-to-top";
import { VisitorCounter } from "@/components/public/visitor-counter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContactProvider>
      <VisitorCounter />
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </ContactProvider>
  );
}
