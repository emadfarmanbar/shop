"use client";
import React, { useState, useEffect } from "react";
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from "@mui/material";
import { MdShoppingCart, MdDeleteForever } from "react-icons/md"; // استفاده از آیکون‌ها
import { useRouter } from 'next/navigation'; // تغییر از next/router به next/navigation

interface CartProduct {
  product: string;
  count: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false); // وضعیت باز بودن مودال
  const [productToRemove, setProductToRemove] = useState<string | null>(null); // محصولی که قرار است حذف شود
  const router = useRouter(); // استفاده از useRouter برای روتینگ

  // بارگذاری سبد خرید از localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    setLoading(false);
  }, []);

  // تابع برای دریافت جزئیات محصول از API
  const getProductDetailsById = async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`);
      const data = await response.json();
      return data.data.product; // محصول دریافت‌شده از API
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // بارگذاری جزئیات محصولات به ازای هر محصول موجود در سبد خرید
  useEffect(() => {
    const fetchProductDetails = async () => {
      const fetchedProducts = await Promise.all(
        cart.map(async (cartProduct) => {
          const productDetails = await getProductDetailsById(cartProduct.product);
          return { ...cartProduct, details: productDetails };
        })
      );
      setProducts(fetchedProducts.filter((product) => product.details !== null));
    };

    if (cart.length > 0) {
      fetchProductDetails();
    }
  }, [cart]);

  // محاسبه مجموع قیمت سبد خرید
  const totalPrice = products.reduce((total, product) => {
    return total + (product.details?.price || 0) * product.count;
  }, 0);

  // تابع برای حذف محصول از سبد خرید
  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((product) => product.product !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ذخیره در localStorage
    setOpenModal(false); // بستن مودال بعد از حذف
  };

  // باز کردن مودال برای تایید حذف
  const handleOpenModal = (productId: string) => {
    setProductToRemove(productId);
    setOpenModal(true);
  };

  // بستن مودال
  const handleCloseModal = () => {
    setOpenModal(false);
    setProductToRemove(null);
  };

  // هدایت به صفحه checkout
  const handleCheckout = () => {
    router.push('/checkout'); // هدایت به صفحه checkout
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg">
        <Typography variant="h4" className="text-center font-bold mb-4 text-green-600">
          سبد خرید شما
        </Typography>

        {/* بررسی خالی بودن سبد خرید */}
        {cart.length === 0 ? (
          <Paper className="p-6 text-center shadow-md bg-gray-50">
            <MdShoppingCart size={50} className="text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-500">
              سبد خرید شما خالی است
            </Typography>
            <Button variant="contained" color="success" className="mt-4">
              ادامه خرید
            </Button>
          </Paper>
        ) : (
          <>
            {products.map((product) => {
              return (
                <div
                  key={product.product}
                  className="border-b border-gray-300 py-3 flex justify-between items-center"
                >
                  <div className="flex items-center p-3">
                    <img
                      src={`http://localhost:8000/images/products/thumbnails/${product.details?.thumbnail}`}
                      alt={product.details?.name}
                      className="h-20 w-20 object-cover rounded-lg mr-4"
                    />
                    <div className="mr-3">
                      <Typography variant="h6" className="text-green-700">{product.details?.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.details?.description}
                      </Typography>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {product.count} × {product.details?.price.toLocaleString() || "قیمت در دسترس نیست"} تومان
                  </div>
                  <Button
                    onClick={() => handleOpenModal(product.product)}
                    variant="outlined"
                    color="error"
                    startIcon={<MdDeleteForever />}
                    className="text-red-600 hover:bg-red-100"
                  >
                    حذف
                  </Button>
                </div>
              );
            })}
            <Typography variant="h6" className="mt-4 text-right font-semibold text-green-700">
              مجموع: {totalPrice.toLocaleString()} تومان
            </Typography>
            <Button variant="contained" color="success" fullWidth className="mt-4" onClick={handleCheckout}>
              نهایی کردن سفارش
            </Button>
          </>
        )}

        {/* مودال تایید حذف */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle className="text-green-700">آیا مطمئن هستید؟</DialogTitle>
          <DialogContent>
            <Typography>آیا می‌خواهید این محصول را از سبد خرید خود حذف کنید؟</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              انصراف
            </Button>
            <Button onClick={() => productToRemove && removeFromCart(productToRemove)} color="secondary">
              حذف
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default CartPage;
