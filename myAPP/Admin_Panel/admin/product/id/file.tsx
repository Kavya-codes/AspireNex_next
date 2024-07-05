import PageHeader from "@/app/(admin)/_components/page-header";
import ModifyProduct from "../_components/modify-product";

const ModifyProductPage = () => {
  return (
    <div className="padding-4 margin-top-2 width-three-quarters max-md-width-full center-horizontal">
      <PageHeader title="Modify Product" description="Update product details" />
      <ModifyProduct />
    </div>
  );
};

export default ModifyProductPage;
