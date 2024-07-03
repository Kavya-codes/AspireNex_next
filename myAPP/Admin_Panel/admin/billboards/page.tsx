import React from "react";
import PageHeader from "../../components/PageHeader";
import BillboardTable from "./components/BillboardTable";

const BillboardsPage = () => {
  return (
    <div className="container mx-auto mt-8 p-5 max-w-3xl">
      <PageHeader title="Manage Billboards" description="View and manage your billboards" />
      <BillboardTable />
    </div>
  );
};

export default BillboardsPage;
