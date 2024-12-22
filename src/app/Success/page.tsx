"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Typography, Button } from "@mui/material";
import { MdCheckCircle } from "react-icons/md";

const SuccessPage: React.FC = () => {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <MdCheckCircle size={80} className="text-green-500 mb-4" />
      <Typography variant="h4" className="font-bold mb-2">
        سفارش شما با موفقیت ثبت شد!
      </Typography>
      <Typography variant="body1" className="text-gray-600 mb-6">
        از خرید شما متشکریم. سفارش شما در اسرع وقت پردازش خواهد شد.
      </Typography>
      <Button variant="contained" color="primary" onClick={goToHome}>
        بازگشت به صفحه اصلی
      </Button>
    </div>
  );
};

export default SuccessPage;
