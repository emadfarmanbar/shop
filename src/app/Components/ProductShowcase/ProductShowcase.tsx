"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Product {
  _id: string;
  images: string[];
}

const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        setProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center"
      style={{
        backgroundImage: "url('/image/banner-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header Section */}
      <div className="w-1/2 text-right px-6">
        <h1 className="text-4xl font-bold text-gray-800">تا 75٪ تخفیف</h1>
        <p className="text-gray-600 mt-4">
          با جدیدترین تخفیف‌های ما، تجربه‌ای متفاوت از خرید را برای خود بسازید.
          محصولات متنوع، کیفیت بالا و قیمتی بی‌نظیر در انتظار شماست.{" "}
        </p>
        <button className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
          اکنون خرید کنید
        </button>
      </div>

      {/* Products and Shelf Section */}
      <div className="w-1/2 relative flex flex-col items-center">
        {/* Product Slider */}
        <div className="relative w-[95vh] z-10 h-[50vh]">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={3}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
            className="top-0 p-3"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div className=" h-64 flex-shrink-0">
                  <img
                    src={`http://localhost:8000/images/products/images/${product.images[0]}`}
                    alt="Product"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Shelf */}
        <div className="absolute bottom-0 w-full flex justify-center">
          <img src="/image/stand.png" alt="Shelf" className="w-full max-w-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
