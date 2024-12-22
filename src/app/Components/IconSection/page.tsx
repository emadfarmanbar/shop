import React from 'react';
import { FaShippingFast, FaLock, FaRedoAlt, FaHeadset } from 'react-icons/fa'; // Importing React Icons from react-icons
import { Box, Typography } from '@mui/material'; // Importing MUI components

interface IconData {
  icon: JSX.Element;
  title: string;
  description: string;
}

const iconItems: IconData[] = [
  {
    icon: <FaShippingFast className="text-green-500 text-5xl" />,
    title: 'ارسال رایگان',
    description: 'سفارش بالای 100 هزار تومان',
  },
  {
    icon: <FaLock className="text-green-500 text-5xl" />,
    title: 'پرداخت امن',
    description: '100 پرداخت مطمئن',
  },
  {
    icon: <FaRedoAlt className="text-green-500 text-5xl" />,
    title: 'بازگشت آسان',
    description: '10 روز مهلت بازگشت',
  },
  {
    icon: <FaHeadset className="text-green-500 text-5xl" />,
    title: 'پشتیبانی 7/24',
    description: 'در هر زمان با ما تماس بگیرید',
  },
];

const IconSection: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 w-10/12 m-auto">
      {iconItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-6 p-8 "
        >
          {item.icon}
          <div>
            <Typography variant="h6" className="text-xl text-black pb-2">
              {item.title}
            </Typography>
            <Typography variant="body1" className="text-lg text-gray-600">
              {item.description}
            </Typography>
          </div>
        </div>
      ))}
    </section>
  );
};

export default IconSection;
