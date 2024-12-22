"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance"; // مسیر درست به فایل axios خود را وارد کنید
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // اصلاح: استفاده از useRouter از next/navigation
import Image from "next/image";

const AdminLoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // استفاده از useRouter از next/navigation برای هدایت

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // پاک کردن خطا قبل از درخواست جدید

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      if (response.data.status === "success") {
        // ذخیره توکن‌ها در کوکی
        const { accessToken, refreshToken } = response.data.token;
        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", refreshToken, {
          secure: true,
          sameSite: "strict",
        });

        // هدایت به داشبورد
        router.push("/Admin-Dashboard"); // تغییر به مسیر دلخواه شما
      } else {
        setError("نام کاربری یا کلمه عبور اشتباه است.");
      }
    } catch (error) {
      console.error("خطا در لاگین:", error);
      setError("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center h-screen bg-gray-300 shadow-lg">
      <Box className="w-5/12">
        <Image 
        src="/img/Book.jpg"
        width={600}
        height={700}
        alt="کتابخانه"
        />
      </Box>
      <Box
        component="form"
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-md p-8 w-5/12 h-4/6"
      >
        <Typography variant="h5" align="center" className="uppercase mb-4">
          ورود
        </Typography>

        {error && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            className="mb-2"
          >
            {error}
          </Typography>
        )}

        <Typography variant="body1" className="block mb-2">
          نام کاربری
        </Typography>
        <TextField
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          fullWidth
          variant="outlined"
          className="mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Typography variant="body1" className="block mb-2">
          رمز عبور
        </Typography>
        <TextField
          type="password"
          placeholder="رمز عبور خود را وارد کنید"
          fullWidth
          variant="outlined"
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <FormControlLabel
          control={<Checkbox />}
          label="به خاطر سپردن"
          className="mb-4"
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          className="py-2"
          disabled={loading}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </Button>

        <Typography variant="body2" className="text-gray-500 mt-6 text-center">
          رمز خود را فراموش کرده‌اید؟{" "}
          <a href="#" className="text-green-500 underline">
            اینجا کلیک کنید
          </a>
        </Typography>

        <Typography variant="body2" className="text-gray-500 mt-6 text-center">
          ثبت نام نکرده‌اید؟{" "}
          <a href="#" className="text-green-500 underline">
            ساخت حساب
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLoginPage;
