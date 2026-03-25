import Sidebar from "@/components/Dashboard/Sidebar";
import NavBar from "@/components/shared/NavBar";
import Wrapper from "@/components/shared/Wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 dark:bg-black50">
      <NavBar />
      <Wrapper className="min-h-screen mx-auto sm:flex py-4 px-2 gap-4">
        {/* Sidebar */}
        <div className="sm:w-64 mb-6 sm:mb-0">
          <Sidebar />
        </div>

        {/* Content */}
        <div className="w-full  mt-[4.2rem] ">{children}</div>
      </Wrapper>
    </div>
  );
}
