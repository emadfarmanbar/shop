"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import Cookies from "js-cookie";

// نوع داده برای محصول
interface Product {
  _id: string; // شناسه محصول
  name: string;
  price: number;
  quantity: number;
  rating: {
    rate: number;
    count: number;
  };
  description: string;
  brand: string;
  slugname: string;
}

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]); // مقداردهی پیش‌فرض به آرایه خالی
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updatedQuantity, setUpdatedQuantity] = useState<number>(0);
  const [updatedPrice, setUpdatedPrice] = useState<number>(0);

  // بارگذاری محصولات از API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      
      // اطمینان از اینکه پاسخ شامل داده‌ها باشد
      if (response.data && response.data.data && response.data.data.products) {
        setProducts(response.data.data.products); // داده‌های محصولات را ذخیره کن
      } else {
        console.error("No products found in response");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ویرایش محصول
  const handleEdit = async () => {
    if (selectedProduct) {
      try {
        await axios.patch(
          `http://localhost:8000/api/products/${selectedProduct._id}`,
          {
            quantity: updatedQuantity,
            price: updatedPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          }
        );
        fetchProducts(); // دوباره محصولات را بارگذاری کن
        setOpenModal(false); // بستن مودال
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  // باز کردن مودال برای ویرایش
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setUpdatedQuantity(product.quantity);
    setUpdatedPrice(product.price);
    setOpenModal(true);
  };

  // بستن مودال
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  // بارگذاری محصولات هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        موجودی‌ها
      </Typography>
      
      {/* بررسی اینکه آیا محصولات وجود دارند */}
      {products.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          هیچ محصولی برای نمایش وجود ندارد.
        </Typography>
      ) : (
        <TableContainer component={Paper}  sx={{
          maxHeight: "600px", // حداکثر ارتفاع برای نمایش جدول
          overflowY: "auto", // فعال کردن اسکرول عمودی
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>نام محصول</TableCell>
                <TableCell>تعداد</TableCell>
                <TableCell>قیمت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price} تومان</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEditModal(product)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* مودال برای ویرایش محصول */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-product-modal"
        aria-describedby="modal-to-edit-product"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ویرایش محصول
          </Typography>

          <TextField
            label="تعداد"
            type="number"
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="قیمت"
            type="number"
            value={updatedPrice}
            onChange={(e) => setUpdatedPrice(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCloseModal} color="secondary">
              بستن
            </Button>
            <Button onClick={handleEdit} color="primary" variant="contained">
              ذخیره تغییرات
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Inventory;
