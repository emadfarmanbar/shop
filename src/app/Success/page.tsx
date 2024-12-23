"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Typography, Button, Paper } from "@mui/material";
import { MdCheckCircle } from "react-icons/md"; // آیکون چک

const SuccessPage: React.FC = () => {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-green-50">
      <Paper className="flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-lg w-full max-w-md text-center">
        <MdCheckCircle size={80} className="text-green-500 mb-4" />
        <Typography variant="h4" className="font-bold text-green-600 mb-2">
          سفارش شما با موفقیت ثبت شد!
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-6">
          از خرید شما متشکریم. سفارش شما در اسرع وقت پردازش خواهد شد.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={goToHome}
          className="text-white"
        >
          بازگشت به صفحه اصلی
        </Button>
      </Paper>
    </div>
  );
};

export default SuccessPage;
