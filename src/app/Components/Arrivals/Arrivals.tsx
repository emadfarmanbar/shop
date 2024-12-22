"use client"; // Ensures this component runs on the client-side

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import "swiper/css/navigation"; // Import Swiper navigation styles
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar, FaStarHalfAlt } from "react-icons/fa"; // Importing star icons from react-icons
import { Typography, Button } from "@mui/material"; // MUI components for Typography and Button
import Link from "next/link"; // For linking to product details page

// Interface for Product data type
interface Product {
  _id: string;
  name: string;
  price: number;
  old_price?: number; // old_price is optional now
  description: string;
  thumbnail: string;
  rating: {
    rate: number;
    count: number;
  };
  images: string[];
  brand: string;
  quantity: number;
  slugname: string;
}

const Arrivals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Set the products after the data is fetched
        setProducts(data.data.products);
      } catch (err) {
        setError("Error fetching products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run only once

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section id="arrivals" className="arrivals py-12">
      <h1 className="text-3xl font-semibold text-center mb-8">
        <span>کتابهای جدید</span>
      </h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Navigation, Autoplay]}
        navigation={true}
        autoplay={{ delay: 5000 }}
        className="arrivals-slider"
      >
        {products.map((product) => (
          <SwiperSlide
            key={product._id}
            className="box p-4 border hover:border-gray-300 rounded-lg"
          >
            <div className="image mb-4">
              <img
                src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
                alt={product.name}
                className="h-60 object-cover w-full rounded-md"
              />
            </div>
            <div className="content text-center">
              <h3 className="text-xl font-semibold text-black">{product.name}</h3>
              <div className="price text-lg text-black mt-2">
                {product.price.toLocaleString()} تومان
                {product.old_price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {product.old_price.toLocaleString()} تومان
                  </span>
                )}
              </div>
              <div className="stars flex justify-center mt-2">
                {/* Show rating stars */}
                {[...Array(5)].map((_, index) => {
                  const rating = product.rating.rate;
                  if (index < Math.floor(rating)) {
                    return <FaStar key={index} className="text-yellow-500" />;
                  }
                  if (index === Math.floor(rating) && rating % 1 !== 0) {
                    return <FaStarHalfAlt key={index} className="text-yellow-500" />;
                  }
                  return <FaStar key={index} className="text-gray-300" />;
                })}
              </div>
              <div className="quantity-status mt-2">
                {/* Quantity Status */}
                <span className={`text-sm font-semibold ${product.quantity > 0 ? "text-green-500" : "text-red-500"}`}>
                  {product.quantity > 0 ? "موجود" : "نا موجود"}
                </span>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="mt-4 w-full mb-2"
              >
                اضافه کردن به سبد خرید
              </Button>

              {/* Link to product details using slugname */}
              <Link href={`/product/${product.slugname}`} passHref>
                <Button variant="outlined" className="w-full">
                  مشاهده جزئیات
                </Button>
              </Link>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Arrivals;
