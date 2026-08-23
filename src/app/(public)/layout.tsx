import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactProvider } from "@/contexts/contact-context";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContactProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </ContactProvider>
  );
}
