"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import axios from "axios";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false); // وضعیت باز بودن مودال
  const [addedProduct, setAddedProduct] = useState<string>(""); // نام محصولی که به سبد خرید اضافه شده است

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((response) => {
        const fetchedProducts = response.data.data.products.map(
          (product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            thumbnail: product.thumbnail,
          })
        );
        const shuffled = fetchedProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productInCart = cart.find((item: any) => item.product === product.id);
    if (productInCart) {
      productInCart.count += 1;
    } else {
      cart.push({ product: product.id, count: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedProduct(product.name);
    setOpenModal(true);
  };

  // بستن مودال
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-50 rtl">
        <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">کتاب دات کام</h1>
        </header>

        <main className="flex flex-col items-center mt-16 w-11/12">
          <h2 className="text-4xl font-bold text-blue-700 mb-8">قفسه کتاب</h2>

          <div className="flex justify-between w-full gap-4 mb-8">
            <div className="flex gap-5">
              <Button
                variant="contained"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                تازه‌ها
              </Button>
              <Button
                variant="outlined"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                پرفروش‌ها
              </Button>
            </div>
            <Button
              variant="outlined"
              href={`/Products/ProductsPage`}
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              بیشتر ببینید
            </Button>
          </div>

          <Swiper
            spaceBetween={30}
            slidesPerView={4}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="w-full px-16"
          >
            {products.map((product) => (
              <SwiperSlide
                key={product.id}
                className="flex flex-col items-center mt-16"
              >
                <Link href={`/Products/${product.id}`}>
                  <div className=" w-full flex items-center justify-center  bg-[#30cb719f] p-4 rounded-lg">
                    <Image
                      src={`http://localhost:8000/images/products/thumbnails/${product.thumbnail}`}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded -mt-12"
                      width={200}
                      height={100}
                    />
                  </div>
                  <div className="flex justify-around">
                    <div>
                      <h3 className="text-lg font-bold mt-4 text-[#393D4A]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#393d4a8d]">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-[#9747FF] mt-2">
                        {product.price} تومان
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Button
                        variant="outlined"
                        className="flex items-center gap-2  text-white border-green-600"
                        onClick={() => addToCart(product)} // فراخوانی تابع افزودن به سبد خرید
                        startIcon={<FaShoppingCart />} // افزودن آیکون به دکمه
                      >
                        افزودن به سبد خرید
                      </Button>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </main>
      </div>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>محصول اضافه شد</DialogTitle>
        <DialogContent>
          <Typography>
            محصول "{addedProduct}" با موفقیت به سبد خرید اضافه شد.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            بستن
          </Button>
          <Link href="/Cart">
            <Button color="secondary">مشاهده سبد خرید</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
