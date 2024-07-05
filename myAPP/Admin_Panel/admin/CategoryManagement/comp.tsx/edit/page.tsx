import React from "react";
import EditCategoryForm from "../../components/EditCategoryForm";
import PageHeader from "@/components/PageHeader";

const CategoryEditPage = () => {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <PageHeader title="Edit Category" description="Modify an existing category" />
      <EditCategoryForm />
    </div>
  );
};

export default CategoryEditPage;
