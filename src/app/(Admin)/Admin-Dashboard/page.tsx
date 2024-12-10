"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie"; // اضافه کردن js-cookie

interface Product {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  quantity: number;
  brand: string;
  description: string;
  images?: string[];
  thumbnail?: string;
}

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  orderDate: string;
  status: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    price: 0,
    quantity: 0,
    brand: "",
    description: "",
    thumbnail: null as File | null,
    images: [] as File[], // اضافه کردن فیلد برای تصاویر
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);

  const accessToken = Cookies.get("accessToken");

  // دریافت لیست محصولات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        setProducts(response.data.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // دریافت لیست سفارشات
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/orders");
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    if (tabIndex === 2) {
      fetchOrders();
    }
  }, [tabIndex]);

  // مدیریت باز و بسته شدن مودال‌ها
  const handleOpenProductModal = () => setOpenProductModal(true);
  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setEditingProduct(null); // بازنشانی وضعیت ویرایش پس از بستن مودال
  };

  const handleOpenDeleteModal = (
    type: "product" | "order",
    id: string | number
  ) => {
    if (type === "product") {
      setProductToDelete(id as string);
    } else if (type === "order") {
      setOrderToDelete(id as number);
    }
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  // حذف محصول
  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/api/products/${productToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setOpenDeleteModal(false);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // حذف سفارش
  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(
          `http://localhost:8000/api/orders/${orderToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setOpenDeleteModal(false);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // مدیریت باز و بسته شدن مودال ویرایش
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingProduct(null);
    setError(null);
  };

  // ویرایش محصول
  // ویرایش محصول
  const handleEditProduct = async () => {
    if (!editingProduct) return;

    const formData = new FormData();

    // فقط فیلدهایی که تغییر کرده‌اند را به FormData اضافه می‌کنیم
    if (editingProduct.name) {
      formData.append("name", editingProduct.name);
    }

    if (editingProduct.category) {
      formData.append("category", editingProduct.category);
    }

    try {
      // ارسال درخواست PATCH به سرور برای ویرایش محصول
      const response = await axios.patch(
        `http://localhost:8000/api/products/${editingProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Product edited successfully", response.data);
      setOpenEditModal(false); // بستن مودال ویرایش
      window.location.reload(); // رفرش صفحه برای به‌روز شدن اطلاعات
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error editing product:",
          error.response?.data || error.message
        );
        setError("خطا در ویرایش محصول.");
      } else {
        console.error("Unexpected error:", error);
        setError("خطا در ویرایش محصول.");
      }
    }
  };

  // افزودن محصول جدید
  const handleAddProduct = async () => {
    // بررسی پر بودن فیلدهای اجباری
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.subcategory ||
      !newProduct.price ||
      !newProduct.quantity ||
      !newProduct.brand ||
      !newProduct.description
    ) {
      setError("تمامی فیلدهای اجباری باید پر شوند.");
      return;
    }

    // ایجاد فرمت ارسال اطلاعات به سرور
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("subcategory", newProduct.subcategory);
    formData.append("price", newProduct.price.toString());
    formData.append("quantity", newProduct.quantity.toString());
    formData.append("brand", newProduct.brand);
    formData.append("description", newProduct.description);

    // اگر تصویر شاخص انتخاب شده است
    if (newProduct.thumbnail) {
      formData.append("thumbnail", newProduct.thumbnail);
    }

    // اگر تصاویری انتخاب شده‌اند
    if (newProduct.images.length > 0) {
      newProduct.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      // ارسال داده‌ها به سرور
      await axios.post("http://localhost:8000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOpenProductModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
      setError("خطا در ارسال محصول. لطفا دوباره تلاش کنید.");
    }
  };

  const handleConfirmEditProduct = async (product: Product) => {
    const formData = new FormData();
    formData.append("price", product.price.toString());
    formData.append("quantity", product.quantity.toString());

    try {
      await axios.patch(
        `http://localhost:8000/api/products/${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // پس از تایید تغییرات، وضعیت ویرایش را به حالت اولیه باز می‌گردانیم
      setEditingPrice(null);
      setEditingQuantity(null);
      window.location.reload(); // یا هر روشی که برای آپدیت لیست استفاده می‌کنید
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="mt-10">
      <AppBar position="static">
        <Toolbar>
          {/* عنوان وسط */}
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
            پنل مدیریت سایت
          </Typography>

          {/* تب‌ها */}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            centered
          >
            <Tab
              label="کالاها"
              sx={{
                color: tabIndex === 0 ? "white" : "inherit", // رنگ متن برای تب فعال سفید باشد
                "&.Mui-selected": {
                  color: "white", // تغییر رنگ متن تب فعال
                },
              }}
            />
            <Tab
              label="موجودی و قیمت‌ها"
              sx={{
                color: tabIndex === 1 ? "white" : "inherit",
                "&.Mui-selected": {
                  color: "white",
                },
              }}
            />
            <Tab
              label="سفارش‌ها"
              sx={{
                color: tabIndex === 2 ? "white" : "inherit",
                "&.Mui-selected": {
                  color: "white",
                },
              }}
            />
          </Tabs>
          {/* دکمه بازگشت به سایت */}
          <Button
            variant="contained"
            color="primary"
            href="/" // هدایت به صفحه اصلی
            style={{ marginRight: "auto" }}
          >
            برگشت به سایت
          </Button>
        </Toolbar>
      </AppBar>

      {/* تب کالاها */}
      {tabIndex === 0 && (
        <>
          <Box className="my-4 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenProductModal}
            >
              افزودن کالا
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام کالا</TableCell>
                  <TableCell>دسته‌بندی</TableCell>
                  <TableCell>قیمت</TableCell>
                  <TableCell>موجودی</TableCell>
                  <TableCell>برند</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {product.category} / {product.subcategory}
                    </TableCell>
                    <TableCell>{product.price} تومان</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditModal(product)}
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleOpenDeleteModal("product", product._id)
                        }
                      >
                        حذف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabIndex === 1 && (
        <>
          <Box className="my-4">
            <Typography variant="h5" className="mb-4">
              موجودی و قیمت‌ها
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام کالا</TableCell>
                    <TableCell>قیمت</TableCell>
                    <TableCell>مقدار</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>

                      {/* قیمت قابل ویرایش */}
                      <TableCell>
                        {editingPrice === product._id ? (
                          <TextField
                            value={product.price}
                            onChange={(e) =>
                              setProducts((prevProducts) =>
                                prevProducts.map((p) =>
                                  p._id === product._id
                                    ? {
                                        ...p,
                                        price: parseFloat(e.target.value),
                                      }
                                    : p
                                )
                              )
                            }
                            type="number"
                            fullWidth
                          />
                        ) : (
                          <span onClick={() => setEditingPrice(product._id)}>
                            {product.price} تومان
                          </span>
                        )}
                      </TableCell>

                      {/* تعداد قابل ویرایش */}
                      <TableCell>
                        {editingQuantity === product._id ? (
                          <TextField
                            value={product.quantity}
                            onChange={(e) =>
                              setProducts((prevProducts) =>
                                prevProducts.map((p) =>
                                  p._id === product._id
                                    ? {
                                        ...p,
                                        quantity: parseInt(e.target.value),
                                      }
                                    : p
                                )
                              )
                            }
                            type="number"
                            fullWidth
                          />
                        ) : (
                          <span onClick={() => setEditingQuantity(product._id)}>
                            {product.quantity}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {editingPrice === product._id ||
                        editingQuantity === product._id ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleConfirmEditProduct(product)}
                          >
                            تایید
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      {/* تب سفارشات */}
      {tabIndex === 2 && (
        <>
          <Box className="my-4">
            <Typography variant="h5" className="mb-4">
              سفارش‌ها
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>شناسه سفارش</TableCell>
                    <TableCell>نام کاربر</TableCell>
                    <TableCell>مجموع مبلغ</TableCell>
                    <TableCell>زمان ثبت سفارش</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.totalAmount} تومان</TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() =>
                            handleOpenDeleteModal("order", order.id)
                          }
                        >
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      {/* مودال افزودن و ویرایش محصول */}
      <Modal open={openProductModal} onClose={handleCloseProductModal}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Typography variant="h6" className="mb-4">
            {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
          </Typography>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* فرم ویرایش و افزودن محصول */}
          <TextField
            label="نام کالا"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
            error={!newProduct.name && error !== null} // اگر فیلد پر نشده باشد و خطا وجود داشته باشد، رنگ خطا نمایش داده می‌شود
          />

          <TextField
            label="دسته‌بندی"
            fullWidth
            margin="normal"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            required
            error={!newProduct.category && error !== null}
          />

          <TextField
            label="زیرمجموعه"
            fullWidth
            margin="normal"
            value={newProduct.subcategory}
            onChange={(e) =>
              setNewProduct({ ...newProduct, subcategory: e.target.value })
            }
            required
            error={!newProduct.subcategory && error !== null}
          />

          <TextField
            label="قیمت"
            fullWidth
            margin="normal"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: parseFloat(e.target.value),
              })
            }
            required
            error={newProduct.price <= 0 && error !== null}
          />

          <TextField
            label="مقدار"
            fullWidth
            margin="normal"
            type="number"
            value={newProduct.quantity}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                quantity: parseInt(e.target.value, 10),
              })
            }
            required
            error={newProduct.quantity <= 0 && error !== null}
          />

          <TextField
            label="برند"
            fullWidth
            margin="normal"
            value={newProduct.brand}
            onChange={(e) =>
              setNewProduct({ ...newProduct, brand: e.target.value })
            }
            required
            error={!newProduct.brand && error !== null}
          />

          <TextField
            label="توضیحات"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            required
            error={!newProduct.description && error !== null}
          />

          {/* ادامه فیلدها به همین صورت برای سایر ویژگی‌ها... */}

          <Box className="mt-4 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={editingProduct ? handleEditProduct : handleAddProduct}
            >
              {editingProduct ? "ویرایش" : "افزودن"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Typography variant="h6" className="mb-4">
            ویرایش محصول
          </Typography>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* فرم ویرایش محصول */}
          <TextField
            label="نام کالا"
            fullWidth
            margin="normal"
            value={editingProduct?.name || ""}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct!, name: e.target.value })
            }
            required
          />

          <TextField
            label="دسته‌بندی"
            fullWidth
            margin="normal"
            value={editingProduct?.category || ""}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct!,
                category: e.target.value,
              })
            }
            required
          />

          <div className="mt-4 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProduct}
            >
              ویرایش محصول
            </Button>
          </div>
        </Box>
      </Modal>

      {/* مودال تایید حذف */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Typography variant="h6" className="mb-4">
            آیا مطمئن هستید؟
          </Typography>
          <Box className="flex justify-between">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseDeleteModal}
            >
              انصراف
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={
                productToDelete ? handleDeleteProduct : handleDeleteOrder
              }
            >
              تایید حذف
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProductManagement;
