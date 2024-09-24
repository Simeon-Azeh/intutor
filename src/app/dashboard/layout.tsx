import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* Sidebar Menu */}
      <div className="w-[14%] md:w-[8%] lg:w-[18%] xl:w-[18%] p-2 bg-white overflow-y-hidden h-full">
        <Link href="/dashboard" className="flex items-center justify-center lg:justify-start ">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
         
        </Link>
        <Menu />
      </div>

      {/* Main Content Area */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto  h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
