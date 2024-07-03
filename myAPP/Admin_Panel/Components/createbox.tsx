import Link from "next/link";
import React from "react";

const CreateButton = () => {
  return (
    <Link href="/admin/products/new">
      <a className="block w-full max-w-xs mx-auto text-center py-2 px-4 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-md transition duration-300 ease-in-out">
        Create Product
      </a>
    </Link>
  );
};

export default CreateButton;
