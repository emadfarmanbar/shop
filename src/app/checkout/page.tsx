"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Typography } from "@mui/material";

const CheckoutPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ارسال درخواست ثبت‌نام
      const signupResponse = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!signupResponse.ok) {
        console.error("Signup failed");
        setLoading(false);
        return;
      }

      const signupData = await signupResponse.json();
      const userId = signupData.data.user._id; // گرفتن آیدی کاربر از پاسخ

      // دریافت محصولات از localStorage
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      // آماده‌سازی داده‌ها برای سفارش
      const orderData = {
        user: userId,
        products: cart.map((item: any) => ({
          product: item.product,
          count: item.count,
        })),
        deliveryStatus: true,
      };

      // ارسال درخواست ایجاد سفارش
      const orderResponse = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        console.error("Order creation failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      localStorage.removeItem("cart"); // پاک کردن سبد خرید از localStorage
      router.push("/SuccessPage"); // هدایت به صفحه موفقیت
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h4" className="text-center mb-6">
        تکمیل اطلاعات سفارش
      </Typography>
      <form className="flex flex-col gap-4">
        <TextField label="نام" name="firstname" onChange={handleChange} fullWidth />
        <TextField label="نام خانوادگی" name="lastname" onChange={handleChange} fullWidth />
        <TextField label="نام کاربری" name="username" onChange={handleChange} fullWidth />
        <TextField label="رمز عبور" name="password" type="password" onChange={handleChange} fullWidth />
        <TextField label="شماره تلفن" name="phoneNumber" onChange={handleChange} fullWidth />
        <TextField label="آدرس" name="address" onChange={handleChange} fullWidth />
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "در حال ارسال..." : "ثبت سفارش"}
        </Button>
      </form>
      {success && (
        <Typography variant="body1" color="green" className="mt-4">
          سفارش شما با موفقیت ثبت شد!
        </Typography>
      )}
    </div>
  );
};

export default CheckoutPage;
