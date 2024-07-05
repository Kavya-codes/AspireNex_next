import { useState } from "react";
import axios from "axios";
import TitleHeader from "@/app/(admin)/_components/title-header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import ReactPaginate from "react-paginate";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDate, sortByDate } from "@/app/utils/formateDate";

type Size = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
};

const TableSizes = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const sizesPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sizes");
      const sortedData = sortByDate(data);
      return sortedData as Size[];
    },
  });

  const offset = currentPage * sizesPerPage;
  const currentSizes = data?.slice(offset, offset + sizesPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const deleteSize = async (id: string) => {
    try {
      await axios.delete(`/api/sizes/${id}`);
      queryClient.invalidateQueries(["sizes"]);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <>
      <TitleHeader
        title="Sizes"
        count={data?.length}
        description="Manage sizes for your store"
        url="/admin/sizes/new"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="text-gray-700">Value</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Date</p>
              </TableCell>
              <TableCell align="right">
                <p className="text-gray-700">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSizes?.map((size) => (
              <TableRow
                key={size.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="left">
                  {size.name}
                </TableCell>
                <TableCell align="center">
                  {formatDate(size.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <button onClick={() => deleteSize(size.id)}>
                    <DeleteIcon className="text-red-600" />
                  </button>
                  <EditIcon />
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
          pageCount={Math.ceil(data?.length / sizesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
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

export default TableSizes;
