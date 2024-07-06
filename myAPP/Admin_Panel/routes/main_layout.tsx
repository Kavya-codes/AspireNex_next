import CustomNavBar from "@/components/navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <CustomNavBar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default MainLayout;
