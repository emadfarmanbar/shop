"use client";

import React, { useState } from "react";
import { Button, TextField, Box, Typography, Container, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const AdminLoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        username,
        password,
      });

      if (response.data.status === "success") {
        // ذخیره توکن‌ها در کوکی
        const { accessToken, refreshToken } = response.data.token;
        Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
        Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });

        // ریدایرکت به داشبورد بعد از لاگین موفق
        router.push("/admin/dashboard");
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
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: 400,
          background: "#f4f6f8",
        }}
      >
        <Typography variant="h4" align="center" sx={{ marginBottom: 3, color: "#1976d2" }}>
          ورود به پنل مدیریت
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="نام کاربری"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="کلمه عبور"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              padding: "10px",
              background: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </Button>
        </Box>

        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              حساب کاربری ندارید؟
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminLoginPage;
