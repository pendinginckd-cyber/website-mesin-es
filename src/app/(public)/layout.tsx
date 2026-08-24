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
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </ContactProvider>
  );
}
