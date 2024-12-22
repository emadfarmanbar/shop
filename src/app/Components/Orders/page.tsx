"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import VisibilityIcon from '@mui/icons-material/Visibility';

// نوع داده برای سفارش
interface Order {
  _id: string;
  customerName: string;
  totalAmount: number;
  orderDate: string;
  status: string;
}

interface OrderDetails {
  _id: string;
  customerName: string;
  items: { productName: string; quantity: number; price: number }[];
  shippingAddress: string;
  totalAmount: number;
  orderDate: string;
  status: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]); // برای ذخیره لیست سفارشات
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // بارگذاری سفارشات از API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      // نمایش ساختار کل داده دریافتی
      console.log("API Response:", response.data);

      if (response.data && response.data.orders) {
        setOrders(response.data.orders); // ذخیره سفارشات در وضعیت
      } else {
        setError("سفارشی یافت نشد"); // پیام به‌روز شده
        setOrders([]); // اگر داده‌ای نبود، آرایه خالی قرار دهیم
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("خطا در بارگذاری سفارشات"); // پیام خطای جدید
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری اطلاعات جزئیات سفارش
  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (response.data && response.data.order) {
        setSelectedOrder(response.data.order); // ذخیره جزئیات سفارش در وضعیت
        setOpenModal(true); // باز کردن مودال
      } else {
        setSelectedOrder(null); // اگر سفارش وجود نداشت
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // بستن مودال
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  // بارگذاری سفارشات هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        سفارشات
      </Typography>

      {/* بررسی اینکه آیا سفارشات وجود دارند */}
      {loading ? (
        <Typography variant="body1" color="textSecondary" align="center">
          در حال بارگذاری...
        </Typography>
      ) : error ? (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      ) : orders.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          سفارشی یافت نشد.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>نام مشتری</TableCell>
                <TableCell>مجموع مبلغ</TableCell>
                <TableCell>تاریخ سفارش</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.totalAmount} تومان</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => fetchOrderDetails(order._id)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* مودال برای جزئیات سفارش */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="order-details-modal"
        aria-describedby="modal-to-show-order-details"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            جزئیات سفارش
          </Typography>

          {selectedOrder ? (
            <>
              <Typography variant="body1">
                <strong>نام مشتری:</strong> {selectedOrder.customerName}
              </Typography>
              <Typography variant="body1">
                <strong>آدرس ارسال:</strong> {selectedOrder.shippingAddress}
              </Typography>
              <Typography variant="body1">
                <strong>تاریخ سفارش:</strong> {selectedOrder.orderDate}
              </Typography>
              <Typography variant="body1">
                <strong>وضعیت:</strong> {selectedOrder.status}
              </Typography>
              <Typography variant="h6" mt={2}>
                آیتم‌ها:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>نام محصول</TableCell>
                    <TableCell>تعداد</TableCell>
                    <TableCell>قیمت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price} تومان</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              سفارشی یافت نشد.
            </Typography>
          )}

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} color="secondary">
              بستن
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Orders;
