import FeaturedCarousel from "@/components/FeaturedCarousel";
import { CarouselWrapper } from "@/components/CarouselWrapper";
import SiteFooter from "@/components/SiteFooter";
import HeaderWithTitle from "@/components/HeaderWithTitle";
import HeroBanner from "@/components/ui/HeroBanner";
import PageContainer from "@/components/ui/PageContainer";
import { fetchAllProducts, fetchCategories } from "@/lib/api";
import { Product } from "@/types";

const Home = async () => {
  const categories = await fetchCategories();
  const allProducts = await fetchAllProducts();

  const highlightedProducts = allProducts.filter(
    (product: Product) => product.featured
  );

  return (
    <div>
      <PageContainer>
        <HeroBanner />
      </PageContainer>
      <HeaderWithTitle title="Top Categories" url="/shop" />
      <CarouselWrapper items={categories} />
      <section className="margin-bottom-large">
        <HeaderWithTitle title="Highlighted Products" url="/featured" />
        {highlightedProducts.length > 0 && (
          <FeaturedCarousel items={highlightedProducts} />
        )}
      </section>
      <SiteFooter />
    </div>
  );
};

export default Home;
