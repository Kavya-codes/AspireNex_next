// Import necessary modules and functions
import SidebarItems from "./sidebar-items";
import PriceInput from "./price-input";
import { getAllProducts, getCategories } from "@/lib/apiCalls";
import { Category, Product } from "@/types"; // Adjust as per your types

type SidebarProductsProps = {
  category: Category[];
  data: Product[];
};

const SidebarProducts = ({ category, data }: SidebarProductsProps) => {
  return (
    <div className="w-1/6 max-sm:w-full p-4 flex flex-col gap-y-1">
      <p className="font-semibold mt-1">Category</p>
      <SidebarItems category={category} />
      <PriceInput data={data} />
    </div>
  );
};

export async function getServerSideProps() {
  // Fetch category and product data asynchronously
  const categoryPromise = getCategories();
  const dataPromise = getAllProducts();

  // Wait for both promises to resolve
  const [category, data] = await Promise.all([categoryPromise, dataPromise]);

  // Return props to be passed to the component
  return {
    props: {
      category,
      data,
    },
  };
}

export default SidebarProducts;
