import Image from "next/image";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CartItemProps {
  data: {
    imageURLs: string[];
    title: string;
    category: string;
    size: string;
    totalPrice?: number;
    finalPrice?: number;
    price: number;
    quantity: number;
  };
  onRemoveAll: () => void;
  onRemove: () => void;
  onAdd: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  data,
  onRemoveAll,
  onRemove,
  onAdd,
}) => {
  const baseUrl = "https://kemal-web-storage.s3.eu-north-1.amazonaws.com";

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          src={`${baseUrl}${data.imageURLs[0]}`}
          alt=""
          className="object-cover object-center"
          width={200}
          height={200}
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <button
            onClick={onRemoveAll}
            className="rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">{data.title}</p>
          </div>

          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">
              {data.category[0].toUpperCase() + data.category.slice(1)} /{" "}
              {data.size}
            </p>
          </div>
          <div className="flex flex-col mt-2 gap-y-3 max-md:flex-row max-md:justify-between max-md:items-center">
            <p className="text-lg text-gray-900 font-semibold">
              {data.totalPrice
                ? `$${data.totalPrice.toFixed(2)}`
                : data.finalPrice
                ? `$${data.finalPrice.toFixed(2)}`
                : `$${Number(data?.price).toFixed(2)}`}
            </p>
            <div className="flex max-md:justify-end w-full">
              <div className="border w-28 rounded-3xl p-2 gap-2 flex justify-between">
                <button onClick={onRemove}>
                  <RemoveIcon />
                </button>
                <p>{data.quantity}</p>
                <button onClick={onAdd}>
                  <AddIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
