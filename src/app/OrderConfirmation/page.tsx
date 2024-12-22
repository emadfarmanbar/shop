import React from "react";
import { Button, Typography } from "@mui/material";

const OrderConfirmation: React.FC = () => {
  return (
    <div className="py-8 w-11/12 m-auto">
      <Typography variant="h4" className="text-center mb-8">تایید سفارش</Typography>
      <Typography variant="body1" className="text-center mb-8">
        سفارش شما با موفقیت ثبت شد!
      </Typography>
      <div className="mt-8">
        <Button variant="contained" color="primary" className="w-full">
          مشاهده جزئیات سفارش
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
