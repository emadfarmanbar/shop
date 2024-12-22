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
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  List as ListIcon,
  LocalOffer as LocalOfferIcon,
  Comment as CommentIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import Link from "next/link";

const Header = () => {
  return (
    <>
      {/* بخش اول هدر */}
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* لوگو */}
          <Box display="flex" alignItems="center">
            <BookIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
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
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <InputBase
              placeholder="جستجو کنید"
              sx={{ flex: 1, px: 2 }}
            />
            <IconButton type="submit" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* آیکون‌ها */}
          <Box display="flex" alignItems="center">
            <Link href={`/Cart`}>
            <IconButton color="default">
              <ShoppingCartIcon />
            </IconButton>
            </Link>
            <Link href={`/admin-login`}>
            <IconButton color="default">
              <AccountCircleIcon />
            </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* بخش دوم هدر (منوی ناوبری) */}
      <AppBar position="static" color="success">
        <Toolbar sx={{ justifyContent: "center" }}>
          <Button color="inherit" href="#home">
            خانه
          </Button>
          <Button color="inherit" href="#featured">
            ویژه
          </Button>
          <Button color="inherit" href="#arrivals">
            جدیدها
          </Button>
          <Button color="inherit" href="#reviews">
            نظرات
          </Button>
          <Button color="inherit" href="#blogs">
            وبلاگ
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
