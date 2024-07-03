import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '@/components/Spinner';
import TitleHeader from '@/app/(admin)/_components/title-header';
import formatDate, { sortByDate } from '@/app/utils/formatDate';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';

type CustomCategory = {
  id: string;
  name: string;
  billboard: string;
  category: string;
  createdAt: string;
};

const CustomCategoryTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ['customCategories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/customCategories');
      const sortedData = sortByDate(data);
      return sortedData as CustomCategory[];
    },
  });

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`/api/customCategories/${id}`);
      queryClient.invalidateQueries(['customCategories']);
      toast.success('Category successfully deleted');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const onPageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Failed to fetch categories.</p>;
  }

  const paginatedData = data?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <>
      <TitleHeader
        title="Custom Categories"
        count={data?.length}
        description="Manage custom categories"
        url="/admin/customCategories/new"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="custom category table">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="text-gray-700">Category Name</p>
              </TableCell>
              <TableCell>
                <p className="text-gray-700">Associated Billboard</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Creation Date</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.billboard}</TableCell>
                <TableCell align="center">{formatDate(category.createdAt)}</TableCell>
                <TableCell align="center">
                  <button onClick={() => deleteCategory(category.id)}>
                    <DeleteIcon className="text-red-600" />
                  </button>
                  <Link href={`/admin/customCategories/edit/${category.id}`}>
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
          onPageChange={onPageChange}
          containerClassName="pagination flex space-x-2 justify-end mt-4"
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

export default CustomCategoryTable;
