import PageHeader from "@/components/PageHeader";
import BillboardForm from "../components/BillboardForm";

const NewBillboardsPage = () => {
  return (
    <div className="container mx-auto mt-6 p-5 max-w-2xl">
      <PageHeader heading="Create New Billboard" subheading="Add a new billboard entry" />
      <BillboardForm />
    </div>
  );
};

export default NewBillboardsPage;
