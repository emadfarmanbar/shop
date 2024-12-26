"use client";
// pages/index.tsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import Link from "next/link"; // برای لینک دادن به صفحه محصول

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // برای ذخیره جستجو
  const [searchResults, setSearchResults] = useState<any[]>([]); // نتایج جستجو
  const [loading, setLoading] = useState<boolean>(false); // برای بارگذاری
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // برای کنترل نمایش/عدم نمایش منو

  // مدیریت تغییرات در ورودی جستجو
  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setIsMenuOpen(false); // منو را ببندیم زمانی که جستجو خالی است
      return;
    }

    setLoading(true);
    setIsMenuOpen(true); // زمانی که تایپ می‌شود منو را باز می‌کنیم

    try {
      // ارسال درخواست به API
      const response = await fetch(`http://localhost:8000/api/products`);
      const data = await response.json();

      if (data.status === "success") {
        // جستجو در نتایج براساس نام و توضیحات
        const filteredProducts = data.data.products.filter(
          (product: any) =>
            product.name.includes(query) || product.description.includes(query)
        );
        setSearchResults(filteredProducts);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-[100vh] bg-gray-50 rtl">
      <main className="flex flex-row justify-around w-full items-center h-full">
        <div className="w-3/6 relative h-full">
          <div className="flex flex-row lg:flex-row gap-8 h-full absolute z-10 right-1 top-40">
            <div className="flex flex-col gap-4 text-right">
              <Button
                variant="contained"
                startIcon={<FaShoppingCart />}
                className="bg-green-600 hover:bg-green-700 text-white w-48 h-10"
              >
                مشاهده سبد خرید
              </Button>
              <Button
                variant="outlined"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-3/4"
              >
                درخواست کتاب
              </Button>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-800">۲۰۰ +</h3>
              <p className="text-gray-600">نویسنده</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">۲۰۰۰۰ +</h3>
              <p className="text-gray-600">کتاب</p>
            </div>
          </div>
          <div className="flex justify-center h-full absolute right-52 top-64">
            <div className="relative">
              <div className="absolute w-full h-full bg-green-100 rounded-lg -z-10"></div>
              <img
                src="/img/book.png"
                alt="فردی که کتاب می‌خواند"
                className="w-96 h-auto"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 text-center w-2/6">
          <h1 className="text-4xl font-bold text-blue-700">کتاب دات کام</h1>
          <p className="text-lg text-gray-600 mt-4">
            وارد فروشگاه ما شوید
            <br />
            هر کتاب یک ماجراجویی جدید است
          </p>
          <div className="mt-16 flex justify-center w-full">
            <TextField
              variant="outlined"
              placeholder="کتاب خود را اینجا پیدا کنید"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white rounded-md w-10/12"
            />
            <Button
              variant="contained"
              className="mr-4 bg-green-600 hover:bg-green-700 text-white w-2/12"
            >
              جستجو
            </Button>
          </div>

          {/* نمایش نتایج جستجو */}
          {isMenuOpen && (
            <Box
              sx={{
                width: "100%",
                maxHeight: "300px",
                overflowY: "auto",
                marginTop: "10px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {loading ? (
                <div className="flex justify-center py-4">
                  <CircularProgress size={24} />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                  نتیجه‌ای یافت نشد
                </div>
              ) : (
                searchResults.map((product: any) => (
                  <Link
                    href={`/Products/${product._id}`} // لینک به صفحه محصول
                    key={product._id}
                    passHref
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                        cursor: "pointer",
                        ":hover": {
                          backgroundColor: "#f7f7f7",
                        },
                      }}
                    >
                      <img
                        src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-full mr-4"
                      />
                      <div className="flex justify-between w-11/12">
                        <div>
                          <Typography variant="body1" className="font-semibold">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {product.description}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="body1"
                            className="text-green-600"
                          >
                            {product.price.toLocaleString()} تومان
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  </Link>
                ))
              )}
            </Box>
          )}
        </div>
      </main>

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600"
      >
        <FaWhatsapp className="text-white text-2xl" />
      </a>
    </div>
  );
};

export default Home;
