
import PageHeader from "@/app/(admin)/_components/page-header";
import BillboardEditor from "../../_components/billboard-editor";


const UpdatedBillboardPage = () => {
  return (
    <div className="container mx-auto mt-6 p-5 max-w-2xl">
      <PageHeader heading="Edit Billboard" subheading="Modify the details of a billboard" />
      <BillboardEditor />
    </div>
  );
};

export default UpdatedBillboardPage;
