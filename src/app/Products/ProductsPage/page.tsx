"use client";
import React, { useState, useEffect } from "react";
import { Typography, Button, CircularProgress, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const router = useRouter();

  // دریافت محصولات از API
  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/products?page=${page}`);
      const data = await response.json();
      const fetchedProducts = data.data.products;
      setProducts((prev) => [...prev, ...fetchedProducts]);
      setHasMore(fetchedProducts.length > 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // دریافت محصولات هنگام بارگذاری صفحه
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // هدایت به صفحه جزئیات محصول
  const handleProductClick = (id: string) => {
    router.push(`/Products/${id}`);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="text-center font-bold mb-6 text-green-600">
        همه محصولات
      </Typography>

      {/* نمایش محصولات */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Paper
              elevation={3}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProductClick(product._id)}
            >
              <img
                src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <Typography variant="h6" className="text-gray-800">
                {product.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mb-2">
                قیمت: {product.price.toLocaleString()} تومان
              </Typography>
              <Button variant="contained" color="primary" fullWidth>
                مشاهده جزئیات
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* دکمه بارگذاری بیشتر */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "بارگذاری بیشتر"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
