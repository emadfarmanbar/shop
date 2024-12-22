"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Button,
  CircularProgress,
  Paper,
  Rating,
  Chip,
} from "@mui/material";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    icon: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
  brand: string;
  quantity: number;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product details");
      const data = await response.json();
      setProduct(data.data.product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10">
        <Typography variant="h5" color="error">
          محصول یافت نشد!
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <Paper elevation={3} className="p-8 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* تصویر محصول */}
          <div className="md:w-1/2">
            <img
              src={`http://localhost:8000/images/products/${product.thumbnail}`}
              alt={product.name}
              className="rounded-md w-full object-cover"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <Typography variant="h4" className="text-green-600">
              {product.name}
            </Typography>
            <Typography variant="h6" className="text-gray-800">
              قیمت: {product.price.toLocaleString()} تومان
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              {product.description}
            </Typography>
            <div className="flex gap-2">
              <Chip label={`برند: ${product.brand}`} color="primary" />
              <Chip label={`دسته‌بندی: ${product.category.name}`} color="secondary" />
              <Chip label={`زیرمجموعه: ${product.subcategory.name}`} variant="outlined" />
            </div>
            <Typography variant="body2" className="text-gray-700">
              تعداد موجودی: {product.quantity}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="body1" className="text-gray-800">
                امتیاز:
              </Typography>
              <Rating
                value={product.rating.rate}
                precision={0.5}
                readOnly
              />
              <Typography variant="caption" className="text-gray-500">
                ({product.rating.count} نظر)
              </Typography>
            </div>
            <Button variant="contained" color="primary" fullWidth>
              اضافه به سبد خرید
            </Button>
          </div>
        </div>

        {/* تصاویر بیشتر محصول */}
        {product.images && product.images.length > 0 && (
          <div className="mt-6">
            <Typography variant="h6" className="text-gray-700 mb-4">
              تصاویر بیشتر:
            </Typography>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:8000/images/products/${image}`}
                  alt={`تصویر ${index + 1}`}
                  className="rounded-md object-cover w-full h-32"
                />
              ))}
            </div>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default ProductDetail;
