import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import Spinner from '@/components/Spinner';
import Header from '@/components/Header';
import formatTimestamp, { orderByDate } from '@/utils/dateUtils';

type CategoryType = {
  id: string;
  name: string;
  billboard: string;
  createdAt: string;
};

const CategoryManagement = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();
  const router = useRouter();

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    return orderByDate(response.data) as CategoryType[];
  };

  const { data, error, isLoading } = useQuery('categories', fetchCategories);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      queryClient.invalidateQueries('categories');
      toast.success('Category removed successfully.');
    } catch {
      toast.error('Failed to remove category.');
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPageIndex(selected);
  };

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading categories.</p>;

  const displayedData = data?.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  return (
    <>
      <Header title="Manage Categories" description="Control and organize your categories" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Billboard</TableCell>
              <TableCell align="center">Creation Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.billboard}</TableCell>
                <TableCell align="center">{formatTimestamp(category.createdAt)}</TableCell>
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
          containerClassName="pagination flex justify-end mt-4 space-x-2"
          previousLinkClassName="bg-gray-800 px-4 py-2 rounded text-white"
          nextLinkClassName="bg-gray-800 px-4 py-2 rounded text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
          activeClassName="bg-blue-700"
          pageClassName="hidden"
        />
      )}
    </>
  );
};

export default CategoryManagement;
