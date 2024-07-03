"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditBillboard = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formState, setFormState] = useState({
    billboardText: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({
    billboardText: "",
    image: "",
  });

  const imageBaseUrl = "https://kemal-web-storage.s3.eu-north-1.amazonaws.com";

  const { data } = useQuery({
    queryKey: ["billboard", id],
    queryFn: async () => {
      const response = await axios.get(`/api/billboards/edit/${id}`);
      if (id) setFormState(response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (id) setPreview(`${imageBaseUrl}/${data?.imageURL}`);
  }, [id, data?.imageURL]);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormState((prevState) => ({ ...prevState, file: selectedFile || null }));

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(fileUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({
      billboardText: "",
      image: "",
    });

    if ((!formState.file && !id) || !formState.billboardText || formState.billboardText.length < 4) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: !formState.file && !id ? "File is required" : "",
        billboardText: formState.billboardText.length < 4 ? "Billboard text must be at least 4 characters long" : "",
      }));
      return;
    }

    const submissionData = new FormData();
    submissionData.append("file", formState.file);
    submissionData.append("billboardText", JSON.stringify(formState.billboardText));

    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/billboards/edit/${id}`, submissionData);
        toast.success("Billboard updated successfully");
        router.push("/admin/billboards");
      } else {
        await axios.post("/api/billboards", submissionData);
        toast.success("New billboard created");
        router.push("/admin/billboards");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="file" className="font-semibold">
            Upload Image
          </label>
          {preview && (
            <Image
              src={preview}
              alt="Image Preview"
              width={100}
              height={100}
              className="rounded-sm"
            />
          )}
          <Input
            type="file"
            id="file"
            name="file"
            onChange={handleFileInputChange}
            className="w-full md:w-2/6"
          />
          {formErrors.image && <p className="text-red-500">{formErrors.image}</p>}
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="billboardText" className="font-semibold">
            Billboard Text
          </label>
          <Input
            type="text"
            name="billboardText"
            value={formState.billboardText}
            onChange={(e) => setFormState({ ...formState, billboardText: e.target.value })}
            className="w-full md:w-2/6"
          />
          {formErrors.billboardText && (
            <p className="text-red-500">{formErrors.billboardText}</p>
          )}
        </div>
      </div>
      <Button
        disabled={loading}
        type="submit"
        className="mt-4 px-7 bg-green-600"
      >
        {id ? "Update" : "Create"}
      </Button>
    </form>
  );
};

export default EditBillboard;
