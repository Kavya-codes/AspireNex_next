import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter, useParams } from "next/router";
import toast from "react-hot-toast";

type CategoryFormData = {
  category: string;
  selectedBillboard: string;
  billboardId: string;
};

type Billboard = {
  id: string;
  name: string;
};

const NewCategoryPage = () => {
  const router = useRouter();
  const { categoryId } = useParams<{ categoryId: string }>();

  const initialFormState: CategoryFormData = {
    category: "",
    selectedBillboard: "",
    billboardId: "",
  };

  const [formData, setFormData] = useState<CategoryFormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<CategoryFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [billboards, setBillboards] = useState<Billboard[]>([]);

  useEffect(() => {
    if (categoryId) {
      axios
        .get(`/api/categories/edit/${categoryId}`)
        .then(({ data }) => {
          setFormData({
            category: data.category,
            selectedBillboard: data.billboard,
            billboardId: data.billboardId,
          });
        })
        .catch((error) => {
          console.error("Error fetching category data:", error);
        });
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const { data } = await axios.get("/api/billboards");
        setBillboards(data);
      } catch (error) {
        console.error("Error fetching billboards:", error);
      }
    };

    fetchBillboards();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors(initialFormState);

    const { category, selectedBillboard } = formData;

    if (!category || category.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        category: "Category must be at least 3 characters",
      }));
      return;
    }

    if (!selectedBillboard || selectedBillboard.length < 4) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        selectedBillboard: "Billboard must be at least 4 characters",
      }));
      return;
    }

    setIsLoading(true);

    try {
      if (categoryId) {
        await axios.put(`/api/categories/edit/${categoryId}`, formData);
        toast.success("Category edited successfully.");
        router.push("/admin/categories");
      } else {
        await axios.post("/api/categories", formData);
        toast.success("Category created successfully.");
        router.push("/admin/categories");
      }
    } catch (error) {
      toast.error("Error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 max-md:flex-col">
          <div>
            <label htmlFor="category" className="font-semibold">
              Category Name
            </label>
            <Input
              value={formData.category}
              type="text"
              name="category"
              size={30}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            {formErrors.category && (
              <p className="text-red-500">{formErrors.category}</p>
            )}
          </div>
          <div>
            <label htmlFor="billboard" className="font-semibold">
              Select a Billboard
            </label>
            <select
              className="flex h-10 w-64 max-md:w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              name="billboard"
              id="billboard"
              value={formData.selectedBillboard}
              required
              onChange={(e) =>
                setFormData({
                  ...formData,
                  selectedBillboard: e.target.value,
                  billboardId: e.target.options[
                    e.target.selectedIndex
                  ].getAttribute("data-billboard-id") || "",
                })
              }
            >
              <option value="">Select a billboard</option>
              {billboards.map((board) => (
                <option
                  key={board.id}
                  value={board.name}
                  data-billboard-id={board.id}
                >
                  {board.name}
                </option>
              ))}
            </select>
            {formErrors.selectedBillboard && (
              <p className="text-red-500">{formErrors.selectedBillboard}</p>
            )}
          </div>
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="mt-4 px-7 bg-green-600"
          variant="default"
        >
          {categoryId ? "Edit" : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default NewCategoryPage;
