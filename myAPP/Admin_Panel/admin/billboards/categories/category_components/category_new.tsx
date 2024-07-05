'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/ui-kit/Button';
import { TextInput } from '@/ui-kit/TextInput';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FormData {
  category: string;
  billboard: string;
  billboardId: string;
}

interface BillboardData {
  id: string;
  name: string;
  imageUrl: string;
}

const ManageCategory = () => {
  const router = useRouter();
  const { categoryId } = useParams() as { categoryId: string };
  
  const defaultState: FormData = {
    category: '',
    billboard: '',
    billboardId: '',
  };

  const [formData, setFormData] = useState<FormData>(defaultState);
  const [errors, setErrors] = useState<FormData>(defaultState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [billboards, setBillboards] = useState<BillboardData[]>([]);

  useEffect(() => {
    if (categoryId) {
      axios.get(`/api/categories/${categoryId}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error('Error fetching category data:', error);
        });
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const response = await axios.get('/api/billboards');
        setBillboards(response.data);
      } catch (error) {
        console.error('Error fetching billboards:', error);
      }
    };

    fetchBillboards();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const billboardId = e.target.options?.[e.target.selectedIndex]?.dataset.billboardId || '';

    setFormData(prev => ({
      ...prev,
      [name]: value,
      billboardId,
    }));
  };

  const validateForm = () => {
    const newErrors = { ...defaultState };

    if (formData.category.length < 2) {
      newErrors.category = 'Category name must be at least 2 characters long.';
    }

    if (formData.billboard.length < 4) {
      newErrors.billboard = 'Billboard name must be at least 4 characters long.';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (categoryId) {
        await axios.put(`/api/categories/${categoryId}`, formData);
        toast.success('Category updated successfully.');
      } else {
        await axios.post('/api/categories', formData);
        toast.success('Category created successfully.');
      }
      
      router.push('/admin/categories');
    } catch (error) {
      toast.error('Error saving category.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <label htmlFor="category" className="block font-semibold mb-1">Category Name</label>
          <TextInput
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            errorMessage={errors.category}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="billboard" className="block font-semibold mb-1">Billboard</label>
          <select
            id="billboard"
            name="billboard"
            value={formData.billboard}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a billboard</option>
            {billboards.map(board => (
              <option
                key={board.id}
                value={board.name}
                data-billboard-id={board.id}
              >
                {board.name}
              </option>
            ))}
          </select>
          {errors.billboard && <p className="text-red-500">{errors.billboard}</p>}
        </div>
      </div>
      <Button
        type="submit"
        className="mt-4"
        disabled={isLoading}
      >
        {categoryId ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
};

export default ManageCategory;


  

  
        

              
                  
     
          
          
         
         
