"use client";

import React from "react";
import { Box, Typography, Link as MuiLink, Divider } from "@mui/material";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      className="bg-green-500 text-white py-10"
    >
      <Box className="container mx-auto px-6">
        {/* بخش بالا */}
        <Box className="flex flex-wrap justify-between items-start gap-8">
          {/* توضیحات لوگو */}
          <Box className="w-full md:w-1/3 text-center md:text-left">
            <Typography
              variant="h5"
              component="h3"
              className="font-bold text-white"
            >
              کتابخانه ما
            </Typography>
            <Typography
              variant="body1"
              className="mt-4 leading-relaxed text-white opacity-80"
            >
              با دسترسی به بهترین منابع علمی و آموزشی، کتابخانه ما شما را در
              مسیر یادگیری و پیشرفت همراهی می‌کند. ما برای شما بهترین‌ها را
              فراهم کرده‌ایم.
            </Typography>
          </Box>

          {/* لینک‌های مفید */}
          <Box className="w-full md:w-1/4 text-center md:text-left">
            <Typography
              variant="h6"
              className="font-semibold mb-4 text-white"
            >
              لینک‌های مفید
            </Typography>
            <Box className="space-y-2">
              {["صفحه اصلی", "درباره ما", "تماس با ما", "حریم خصوصی"].map(
                (link, index) => (
                  <MuiLink
                    key={index}
                    href="#"
                    underline="hover"
                    className="block text-white hover:text-gray-300 text-base"
                  >
                    {link}
                  </MuiLink>
                )
              )}
            </Box>
          </Box>

          {/* شبکه‌های اجتماعی */}
          <Box className="w-full md:w-1/4 text-center md:text-right">
            <Typography
              variant="h6"
              className="font-semibold mb-4 text-white"
            >
              شبکه‌های اجتماعی
            </Typography>
            <Box className="flex justify-center md:justify-end gap-4">
              {[
                { icon: FaFacebookF, label: "Facebook" },
                { icon: FaTwitter, label: "Twitter" },
                { icon: FaInstagram, label: "Instagram" },
                { icon: FaLinkedinIn, label: "LinkedIn" },
              ].map((social, index) => (
                <MuiLink
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className="bg-white hover:bg-gray-200 text-green-500 p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
                >
                  {React.createElement(social.icon, { size: 20 })}
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Box>

        {/* خط جداکننده */}
        <Divider className="border-gray-400 my-8" />

        {/* بخش پایین */}
        <Box className="text-center">
          <Typography
            variant="body2"
            className="font-medium text-white"
          >
            © 2024 کتابخانه ما. تمامی حقوق محفوظ است.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
