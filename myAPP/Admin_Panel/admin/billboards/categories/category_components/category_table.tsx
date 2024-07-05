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
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import TitleHeader from "@/components/TitleHeader";
import formatDate, { sortByDate } from "@/utils/formatDate";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  billboard: string;
  category: string;
  createdAt: string;
}

const CategoryTable = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return sortByDate(response.data) as Category[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete category.");
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error loading categories.</p>;
  }

  const offset = page * itemsPerPage;
  const displayedCategories = data?.slice(offset, offset + itemsPerPage);

  return (
    <>
      <TitleHeader
        title="Categories"
        count={data?.length}
        description="Manage your store's categories"
        url="/admin/categories/new"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Billboard</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCategories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.billboard}</TableCell>
                <TableCell align="center">
                  {formatDate(category.createdAt)}
                </TableCell>
                <TableCell align="center">
                  <button onClick={() => handleDelete(category.id)}>
                    <DeleteIcon className="text-red-600" />
                  </button>
                  <Link href={`/admin/categories/edit/${category.id}`}>
                    <EditIcon />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageCount={Math.ceil(data.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-end mt-4"
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

export default CategoryTable;
