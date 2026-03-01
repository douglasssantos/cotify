import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrapper ovh">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
