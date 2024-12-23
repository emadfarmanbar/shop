import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Book as BookIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import Link from "next/link";

const Header = () => {
  return (
    <>
      {/* بخش اول هدر */}
      <AppBar position="static" color="inherit" elevation={0} sx={{ backgroundColor: "#fff" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* لوگو */}
          <Box display="flex" alignItems="center">
            <BookIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="success.main">
              کتابخانه
            </Typography>
          </Box>

          {/* فرم جستجو */}
          <Box
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "50rem",
              height: "3rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <InputBase
              placeholder="جستجو کنید"
              sx={{ flex: 1, px: 2, fontSize: "1rem", color: "text.primary" }}
            />
            <IconButton type="submit" sx={{ p: 1 }}>
              <SearchIcon color="success" />
            </IconButton>
          </Box>

          {/* آیکون‌ها */}
          <Box display="flex" alignItems="center">
            <Link href={`/Cart`}>
              <IconButton color="default">
                <ShoppingCartIcon color="success" />
              </IconButton>
            </Link>
            <Link href={`/Admin-login`}>
              <IconButton color="default">
                <AccountCircleIcon color="success" />
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* بخش دوم هدر (منوی ناوبری) */}
      <AppBar position="static" color="success" sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Button color="inherit" sx={{ fontSize: "1rem" }} href="#home">
            خانه
          </Button>
          <Button color="inherit" sx={{ fontSize: "1rem" }} href="#featured">
            ویژه
          </Button>
          <Button color="inherit" sx={{ fontSize: "1rem" }} href="#arrivals">
            جدیدها
          </Button>
          <Button color="inherit" sx={{ fontSize: "1rem" }} href="#reviews">
            نظرات
          </Button>
          <Button color="inherit" sx={{ fontSize: "1rem" }} href="#blogs">
            وبلاگ
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
