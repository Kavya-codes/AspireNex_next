// components/sidebar/SidebarProducts.tsx
import { useEffect, useState } from 'react';
import { getAllProducts, getCategories } from '@/lib/apiCalls';
import SidebarItems from './SidebarItems';
import PriceInput from './PriceInput';

const SidebarProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const categoryData = await getCategories();
      const productData = await getAllProducts();
      setCategories(categoryData);
      setProducts(productData);
    };
    fetchData();
  }, []);

  return (
    <div className="w-1/6 max-sm:w-full p-4 flex flex-col gap-y-1">
      <p className="font-semibold mt-1">Category</p>
      <SidebarItems categories={categories} />
      <PriceInput products={products} />
    </div>
  );
};

export default SidebarProducts;
