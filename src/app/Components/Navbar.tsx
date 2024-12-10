import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = () => {
  return (
    <AppBar position="static" className="bg-blue-500">
      <Toolbar className="flex justify-between items-center">
        {/* سمت راست: لوگو و اسم */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
          <Typography variant="h6" className="text-white font-bold">
            فروشگاه آنلاین میوه بازار
          </Typography>
        </div>

        {/* سمت چپ: سبد خرید و مدیریت */}
        <div className="flex items-center">
          {/* سبد خرید */}
          <IconButton color="inherit" className="mr-4">
            <Badge>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* دکمه مدیریت */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<SettingsIcon />}
            className="hidden md:block"
            href="Admin-login"
          >
            مدیریت
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
