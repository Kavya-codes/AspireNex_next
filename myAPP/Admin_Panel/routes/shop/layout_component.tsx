// components/Layout.tsx
import SidebarProducts from './sidebar/SidebarProducts';
import SortItems from './sort/SortItems';
import Footer from '@/components/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="min-h-full w-full py-5 sm:px-6 lg:px-10 flex max-sm:flex-col mx-auto max-w-7xl">
        <SidebarProducts />
        <div className="flex-1 p-4 ">
          <SortItems />
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
