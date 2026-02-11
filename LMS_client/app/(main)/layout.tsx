import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="MainLayoutContainer  ">
      {/* nav starts  */}
      <NavBar />
      {/* nav ends */}

      {/* child component  */}
      <div className="childComponent mt-[4.2rem] min-h-screen   ">
        {children}
      </div>
      {/* child component  */}

      <Footer />
    </div>
  );
}
