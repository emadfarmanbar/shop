"use client"; // Ensures this component runs on the client-side

import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { FaEnvelope } from "react-icons/fa"; // Importing an envelope icon from react-icons

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");

  // Handler to update email state
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handler for form submission (you can add actual form submission logic here)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // You can integrate actual logic to send the email to your server
  };

  return (
    <Box
      className="newsletter relative bg-cover bg-center bg-fixed"
      sx={{
        backgroundImage: 'url("/image/letter-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "5rem 0",
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-xl mr-10 text-center">
        <h3 className="text-white text-2xl font-normal pb-4">
          برای آخرین به روز رسانی مشترک شوید
        </h3>

        {/* Email input with MUI TextField */}
        <TextField
          label="ایمیل خود را وارد کنید"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          className="mb-4"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#fff",
            },
          }}
        />

        {/* Submit Button with MUI Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="btn mt-10"
          sx={{
            padding: "0.75rem 2rem",
            fontSize: "1.6rem",
            textTransform: "none",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          عضویت
        </Button>
      </form>

      {/* Optional Icon */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-8">
        <FaEnvelope className="text-white text-4xl" />
      </div>
    </Box>
  );
};

export default Newsletter;
