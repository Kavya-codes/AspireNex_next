import { useEffect } from "react";
import Navbar from "../_components/Navbar";
import Sidebar from "../_components/Sidebar";
import { useRouter } from "next/router";
import { currentUser } from "@clerk/nextjs";

export const metadata = {
  title: "Admin | Kemal Store",
  description: `Admin for e-commerce, selling products, and new productivity`,
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await currentUser();
      if (!user || !user.unsafeMetadata.isAdmin) {
        router.push("/sign-in");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-14 flex h-full gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
