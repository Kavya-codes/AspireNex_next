import { Metadata } from "next";
import ProductItem from "./_components/product-item";
import { getProduct } from "@/lib/apiCalls";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const product = await getProduct(params.productId);

  if (!product) {
    return {
      title: "Kemal Store",
      description: "E-commerce, selling products, and new productivity",
    };
  }

  return {
    title: `${product.title} | ${siteConfig.name}`,
    description: product.description,
  };
}

const ProductPage = ({ params }: { params: { productId: string } }) => {
  return (
    <div>
      <ProductItem productId={params.productId} />
      <Footer />
    </div>
  );
};

export default ProductPage;
