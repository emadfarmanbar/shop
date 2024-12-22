// /src/pages/cart.tsx
"use client";

import React from "react";
import { Button, Typography } from "@mui/material";
import { useCart } from "../app/context/CartContext"; // استفاده از Context

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCart(); // استفاده از Context برای دریافت داده‌های سبد خرید

  const handleRemove = (productId: string) => {
    removeFromCart(productId); // حذف محصول از سبد خرید
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">سبد خرید</h1>
      {cart.length === 0 ? (
        <div className="text-center text-xl">سبد خرید شما خالی است.</div>
      ) : (
        <div>
          {/* نمایش لیست محصولات */}
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="flex-1">{item.productId}</Typography> {/* نمایش شناسه محصول */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemove(item.productId)}
                className="ml-4"
              >
                حذف از سبد خرید
              </Button>
            </div>
          ))}
          <div className="flex justify-end mt-8">
            <Button variant="contained" color="primary" className="px-6 py-2">
              نهایی کردن سفارش
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
