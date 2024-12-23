"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // آیکون برای صفحه‌بندی
import { AiOutlineEye } from "react-icons/ai"; // آیکون مشاهده جزئیات
import Header from "@/app/Components/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortField, setSortField] = useState<string>("");  // اصلاح: مقدار پیش‌فرض را به "" تغییر دادیم
  const router = useRouter();

  // دریافت محصولات از API با توجه به فیلد مرتب‌سازی
  const fetchProducts = async (page: number, sortField: string) => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/products?page=${page}`;
      
      if (sortField) {
        url += `&fields=${sortField}`;  // ارسال فیلد مرتب‌سازی در صورتی که انتخاب شده باشد
      }

      const response = await fetch(url);
      const data = await response.json();
      const fetchedProducts = data.data.products;
  
      // فیلتر کردن محصولات برای اطمینان از اینکه همه محصولات دارای فیلد price هستند
      const validProducts = fetchedProducts.filter(
        (product: any) => product.price !== undefined
      );
  
      setProducts(validProducts);
      setHasMore(fetchedProducts.length > 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // دریافت محصولات هنگام بارگذاری صفحه
  useEffect(() => {
    fetchProducts(page, sortField); // ارسال صفحه و فیلد مرتب‌سازی
  }, [page, sortField]);

  // هدایت به صفحه جزئیات محصول
  const handleProductClick = (id: string) => {
    router.push(`/Products/${id}`);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-green-50 min-h-screen">
        <Typography
          variant="h4"
          className="text-center font-bold mb-6 text-green-700"
        >
          همه محصولات
        </Typography>

        {/* بخش مرتب‌سازی */}
        <Box className="flex justify-center mb-6 gap-4">
          <FormControl variant="outlined" className="w-1/4">
            <InputLabel>مرتب‌سازی بر اساس</InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              label="مرتب‌سازی بر اساس"
            >
              <MenuItem value="">بدون مرتب‌سازی</MenuItem>
              <MenuItem value="price">قیمت</MenuItem>
              <MenuItem value="rating">امتیاز</MenuItem>
              <MenuItem value="createdAt">تاریخ ایجاد</MenuItem>
              <MenuItem value="updatedAt">تاریخ به‌روزرسانی</MenuItem>
              <MenuItem value="name">نام</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* نمایش محصولات */}
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Paper
                elevation={3}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white rounded-lg"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={`http://localhost:8000/images/products/thumbnail/${product.thumbnail}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <Typography
                  variant="h6"
                  className="text-green-800 font-semibold"
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-2"
                >
                  {/* اطمینان از اینکه قیمت تعریف شده باشد */}
                  قیمت: {product.price ? product.price.toLocaleString() : "قیمت نامشخص"}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<AiOutlineEye />}
                >
                  مشاهده جزئیات
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* صفحه‌بندی */}
        <Box className="flex justify-center mt-6 gap-4">
          <Button
            variant="outlined"
            color="success"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            startIcon={<FiChevronRight />}
          >
            قبلی
          </Button>

          <Button
            variant="outlined"
            color="success"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMore || loading}
            endIcon={<FiChevronLeft />}
          >
            بعدی
          </Button>
        </Box>

        {/* دکمه بارگذاری بیشتر در صورتی که محصولات بیشتری برای نمایش باشد */}
        {loading && (
          <Box className="flex justify-center mt-4">
            <CircularProgress size={40} color="success" />
          </Box>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
