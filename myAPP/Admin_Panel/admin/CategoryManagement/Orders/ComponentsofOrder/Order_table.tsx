"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import { formatDate, sortByDate } from "@/app/utils/formatDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import PageHeader from "@/app/(admin)/_components/page-header";

type OrderProduct = {
  id: string;
  orderId: string;
  name: string;
};

type CustomerOrder = {
  id: string;
  paid: boolean;
  contactNumber: string;
  deliveryAddress: string;
  dateOrdered: string;
  products: OrderProduct[];
};

const OrdersTable = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const { error, data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get("/api/orders");
      const sortedOrders = sortByDate(response.data);
      return sortedOrders as CustomerOrder[];
    },
  });

  const offset = page * itemsPerPage;
  const currentOrders = data?.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>An error occurred while fetching orders!</p>;
  }

  return (
    <>
      <PageHeader
        title="Customer Orders"
        itemCount={data?.length}
        description="Manage all customer orders"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="text-gray-700">Product</p>
              </TableCell>
              <TableCell>
                <p className="text-gray-700">Contact</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Address</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Paid</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Order Date</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders?.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.products[0]?.name || "N/A"}
                </TableCell>
                <TableCell align="left">{order.contactNumber}</TableCell>
                <TableCell align="center">{order.deliveryAddress}</TableCell>
                <TableCell align="center">{order.paid ? "Yes" : "No"}</TableCell>
                <TableCell align="center">
                  {formatDate(order.dateOrdered)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(data?.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex space-x-2 justify-end mt-4"}
          previousLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          nextLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-700"}
          pageClassName="hidden"
        />
      )}
    </>
  );
};

export default OrdersTable;
