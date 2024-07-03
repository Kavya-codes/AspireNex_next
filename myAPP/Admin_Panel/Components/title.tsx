import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

const TitleHeader = ({ title, description, count, url }: Props) => {
  return (
    <div className="border-b border-gray-300 mb-4 pb-2">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">
          {title} {count !== undefined ? `(${count})` : ""}
        </h1>
        {url && (
          <Link href={url}>
            <a className="inline-flex items-center space-x-1 py-1 px-2 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-md text-sm transition duration-300 ease-in-out">
              <AddIcon />
              <span>Add New</span>
            </a>
          </Link>
        )}
      </div>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
};

export default TitleHeader;
