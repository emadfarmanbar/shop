"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaHeart, FaEye } from "react-icons/fa"; // React Icons for icons
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"; // MUI components for Typography and Button
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper import
import "swiper/css"; // Correct import for Swiper styles
import "swiper/css/navigation"; // Import Swiper navigation styles
import { Autoplay, Navigation } from "swiper/modules"; // Import Autoplay and Navigation modules
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
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

const FeaturedSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false); // وضعیت باز بودن مودال
  const [addedProduct, setAddedProduct] = useState<string>(""); // نام محصولی که به سبد خرید اضافه شده است

  // Fetch data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        const data = await response.json();
        setProducts(data.data.products); // Assuming `data.products` holds the list of products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // تابع برای اضافه کردن محصول به سبد خرید
  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productInCart = cart.find((item: any) => item.product === product._id);

    if (productInCart) {
      productInCart.count += 1; // افزایش تعداد اگر محصول در سبد خرید موجود است
    } else {
      cart.push({ product: product._id, count: 1 }); // افزودن محصول جدید به سبد خرید
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedProduct(product.name); // نام محصولی که اضافه شده
    setOpenModal(true); // باز کردن مودال
  };

  // بستن مودال
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <section id="featured" className="py-8 w-11/12 m-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-green-500">کتابهای برجسته</span>
      </h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        modules={[Navigation, Autoplay]} // Add Navigation module to the modules array
        navigation={true} // Enable navigation buttons
        autoplay={{
          delay: 5000,
        }}
        className="featured-slider"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="relative border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all">
              <div className="image bg-gradient-to-r from-gray-200 to-white rounded-t-lg">
                <img
                  src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
                  alt={product.name}
                  className="h-64 object-cover w-full rounded-t-lg"
                />
              </div>

              <div className="content bg-white p-4 rounded-b-lg">
                {/* Brand and Price */}
                <div className="brand bg-opacity-70 bg-gray-800 text-white px-3 py-1 rounded-lg absolute top-4 left-4 z-10">
                  {product.brand}
                </div>
                <Typography variant="h6" className="text-xl text-green-600 mb-2">
                  {product.name}
                </Typography>
                <div className="price text-2xl text-black mb-2">
                  {product.price.toLocaleString()} تومان{" "}
                  <span className="text-lg text-gray-500 line-through">
                    {(product.price * 1.2).toLocaleString()} تومان
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-2">
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </p>

                {/* Quantity Status */}
                <div
                  className={`status text-sm font-semibold ${
                    product.quantity > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {product.quantity > 0 ? "موجود" : "نا موجود"}
                </div>

                {/* Button to add to cart */}
                <Button
                  variant="contained"
                  color="success"
                  className="w-full mb-2"
                  onClick={() => addToCart(product)} // فراخوانی تابع افزودن به سبد خرید
                  startIcon={<FaHeart />} // افزودن آیکون به دکمه
                >
                  اضافه کردن به سبد خرید
                </Button>

                {/* Link to product details using slugname */}
                <Link href={`/product/${product.slugname}`} passHref>
                  <Button variant="outlined" className="w-full" startIcon={<FaEye />}>
                    مشاهده جزئیات
                  </Button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* مودال نمایش پیامی برای اضافه شدن به سبد خرید */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>محصول اضافه شد</DialogTitle>
        <DialogContent>
          <Typography>محصول "{addedProduct}" با موفقیت به سبد خرید اضافه شد.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            بستن
          </Button>
          <Link href="/Cart">
            <Button color="secondary">
              مشاهده سبد خرید
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default FeaturedSection;
