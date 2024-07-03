"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Header from "@/app/(admin)/_components/header";
import formatTimestamp, { orderDates } from "@/app/utils/formatTimestamp";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

type Billboard = {
  id: string;
  title: string;
  imageURL: string;
  createdAt: string;
};

const BillboardList = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();
  const storageBaseUrl = "https://kemal-web-storage.s3.eu-north-1.amazonaws.com";

  const { data, error, isLoading } = useQuery({
    queryKey: ["billboards"],
    queryFn: async () => {
      const response = await axios.get("/api/billboards");
      return orderDates(response.data) as Billboard[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/billboards/edit/${id}`);
      queryClient.invalidateQueries(["billboards"]);
      toast.success("Billboard removed successfully");
    } catch (err) {
      toast.error("Failed to remove billboard");
    }
  };

  const handlePageChange = (event: { selected: number }) => {
    setPageNumber(event.selected);
  };

  const currentItems = data?.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

  if (isLoading) return <Loader />;
  if (error) return <p>Unable to load billboards!</p>;

  return (
    <>
      <Header
        title="Billboards"
        itemCount={data?.length}
        description="Manage store billboards effectively"
        createUrl="/admin/billboards/new"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="billboard management table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems?.map((billboard) => (
              <TableRow key={billboard.id}>
                <TableCell>
                  <Image
                    src={`${storageBaseUrl}/${billboard.imageURL}`}
                    alt="Billboard Image"
                    width={60}
                    height={60}
                    className="border rounded-sm"
                  />
                </TableCell>
                <TableCell>{billboard.title}</TableCell>
                <TableCell align="center">
                  {formatTimestamp(billboard.createdAt)}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDelete(billboard.id)}>
                    <DeleteIcon className="text-red-600" />
                  </IconButton>
                  <Link href={`/admin/billboards/edit/${billboard.id}`}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          breakLabel="..."
          pageCount={Math.ceil(data.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-end mt-4 space-x-2"
          previousLinkClassName="bg-neutral-800 px-4 py-2 rounded text-white"
          nextLinkClassName="bg-neutral-800 px-4 py-2 rounded text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
          activeClassName="bg-blue-700"
          pageClassName="hidden"
        />
      )}
    </>
  );
};

export default BillboardList;
