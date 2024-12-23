"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";

// نوع داده برای سفارش
interface Order {
  _id: string;
  user: string; // آیدی کاربر
  products: { product: string; count: number; _id: string }[];
  totalPrice: number;
  deliveryDate: string;
  deliveryStatus: boolean;
  createdAt: string;
  updatedAt: string;
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
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  phoneNumber: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]); // برای ذخیره لیست سفارشات
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map()); // ذخیره اطلاعات کاربر به صورت Map

  // بارگذاری سفارشات از API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      console.log("API Response:", response.data);

      if (response.data.status === "success" && response.data.data.orders) {
        setOrders(response.data.data.orders); // ذخیره سفارشات در وضعیت
        fetchUserDetails(response.data.data.orders);
      } else {
        setError("سفارشی یافت نشد");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("خطا در بارگذاری سفارشات");
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری اطلاعات جزئیات سفارش
  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      // بررسی اینکه آیا داده‌ها به درستی دریافت شده‌اند
      if (response.data.status === "success" && response.data.data.order) {
        const order = response.data.data.order;
        setSelectedOrder({
          _id: order._id,
          customerName: `${order.user.firstname} ${order.user.lastname}`,
          items: order.products.map((product) => ({
            productName: product.product.name,
            quantity: product.count,
            price: product.product.price,
          })),
          shippingAddress: order.user.address,
          totalAmount: order.totalPrice,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          status: order.deliveryStatus ? "تحویل داده شده" : "در حال پردازش",
        });
        setOpenModal(true); // باز کردن مودال
      } else {
        setSelectedOrder(null);
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

  const fetchUserDetails = async (orders: Order[]) => {
    const userIds = Array.from(new Set(orders.map(order => order.user))); // گرفتن لیست آیدی‌های منحصر به فرد کاربران

    try {
      const userResponses = await Promise.all(
        userIds.map(userId =>
          axios.get(`http://localhost:8000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
            },
          })
        )
      );

      const newUsers = new Map<string, User>();
      userResponses.forEach(response => {
        if (response.data.status === "success") {
          const user = response.data.data.user; // اطلاعات کاربر در response.data.data.user قرار دارد
          newUsers.set(user._id, user); // ذخیره اطلاعات کاربر در Map
        }
      });
      setUsers(newUsers);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // بارگذاری سفارشات هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetchOrders();
  }, []);

  // بارگذاری سفارشات هنگام بارگذاری کامپوننت
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", padding: 3 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#4CAF50", fontWeight: "bold" }}
      >
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
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#4CAF50" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  نام مشتری
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  مجموع مبلغ
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  تاریخ سفارش
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  وضعیت
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  عملیات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const user = users.get(order.user); // دریافت اطلاعات کاربر بر اساس آیدی
                return (
                  <TableRow
                    key={order._id}
                    sx={{ "&:hover": { backgroundColor: "#e8f5e9" } }}
                  >
                    <TableCell>
                      {user
                        ? `${user.firstname} ${user.lastname}`
                        : "در حال بارگذاری..."}
                    </TableCell>
                    <TableCell>{order.totalPrice} تومان</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.deliveryStatus
                        ? "تحویل داده شده"
                        : "در حال پردازش"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => fetchOrderDetails(order._id)}
                        color="success"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          <Typography variant="h6" gutterBottom sx={{ color: "#4CAF50" }}>
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
