"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdCancel, MdSave } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // مودال تایید حذف
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<any | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null); // برای ذخیره دسته‌بندی که باید حذف شود
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(
    null
  ); // برای ذخیره زیرگروه که باید حذف شود

  // گرفتن دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories");
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    }
  };

  // گرفتن زیرگروه‌ها
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/subcategories"
      );
      setSubcategories(response.data.data.subcategories);
    } catch (error) {
      console.error("خطا در دریافت زیرگروه‌ها:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // افزودن دسته‌بندی جدید
  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("name", newCategoryName);
    if (newCategoryIcon) formData.append("icon", newCategoryIcon);

    try {
      await axios.post("http://localhost:8000/api/categories", formData);
      setIsCategoryModalOpen(false);
      setNewCategoryName("");
      setNewCategoryIcon(null);
      fetchCategories(); // به‌روزرسانی دسته‌بندی‌ها بعد از افزودن
    } catch (error) {
      console.error("خطا در افزودن دسته‌بندی:", error);
    }
  };

  // تغییر دسته‌بندی
  const handleEditCategory = async () => {
    if (!editingCategory || !editingCategory._id) return;

    const formData = new FormData();
    formData.append("name", editingCategory.name);

    try {
      await axios.patch(
        `http://localhost:8000/api/categories/${editingCategory._id}`,
        formData
      );
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error(
        "خطا در تغییر دسته‌بندی:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // حذف دسته‌بندی
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/categories/${categoryToDelete}`
      );
      setIsDeleteModalOpen(false);
      fetchCategories(); // به‌روزرسانی دسته‌بندی‌ها بعد از حذف
    } catch (error) {
      console.error("خطا در حذف دسته‌بندی:", error);
    }
  };

  // تغییر زیرگروه
  const handleEditSubcategory = async () => {
    if (!editingSubcategory) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/subcategories/${editingSubcategory._id}`,
        {
          name: editingSubcategory.name,
        }
      );
      setIsSubcategoryModalOpen(false);
      setEditingSubcategory(null);
      fetchSubcategories(); // به‌روزرسانی زیرگروه‌ها بعد از تغییر
    } catch (error) {
      console.error("خطا در تغییر زیرگروه:", error);
    }
  };

  // حذف زیرگروه
  const handleDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/subcategories/${subcategoryToDelete}`
      );
      setIsDeleteModalOpen(false);
      fetchSubcategories(); // به‌روزرسانی زیرگروه‌ها بعد از حذف
    } catch (error) {
      console.error("خطا در حذف زیرگروه:", error);
    }
  };

  // افزودن زیرگروه
  const handleAddSubcategory = async (categoryId: string) => {
    if (!newSubcategoryName) return;

    try {
      await axios.post("http://localhost:8000/api/subcategories", {
        category: categoryId,
        name: newSubcategoryName,
      });
      setNewSubcategoryName(""); // پاک کردن ورودی پس از ارسال
      fetchSubcategories(); // به‌روزرسانی زیرگروه‌ها بعد از افزودن
    } catch (error) {
      console.error("خطا در افزودن زیرگروه:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>
      <button
        onClick={() => setIsCategoryModalOpen(true)}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        <MdAdd className="ml-2" />
        افزودن دسته‌بندی
      </button>

      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category._id} className="p-4 border rounded shadow">
            <div className="flex items-center">
              {category.icon && (
                <img
                  src={`http://localhost:8000/${category.icon}`}
                  alt={category.name}
                  className="w-8 h-8 rounded-full mr-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            </div>
            <ul className="ml-4 list-disc">
              {subcategories
                .filter((sub) => sub.category === category._id)
                .map((sub) => (
                  <li key={sub._id} className="mt-2 flex items-center">
                    {sub.name}
                    <button
                      onClick={() => {
                        setEditingSubcategory(sub);
                        setIsSubcategoryModalOpen(true);
                      }}
                      className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                    >
                      <MdEdit className="ml-1" />
                      تغییر
                    </button>
                    <button
                      onClick={() => {
                        setSubcategoryToDelete(sub._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="flex items-center bg-red-600 text-white px-2 py-1 rounded ml-2"
                    >
                      <MdDelete className="ml-1" />
                      حذف
                    </button>
                  </li>
                ))}
            </ul>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="نام زیرگروه"
                value={
                  selectedCategoryId === category._id ? newSubcategoryName : ""
                }
                onChange={(e) => {
                  setSelectedCategoryId(category._id);
                  setNewSubcategoryName(e.target.value);
                }}
                className="border p-2 rounded mr-2"
              />
              <button
                onClick={() => handleAddSubcategory(category._id)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded"
                disabled={!newSubcategoryName} // غیرفعال کردن دکمه زمانی که ورودی خالی است
              >
                <AiOutlinePlus className="ml-2" />
                افزودن زیرگروه
              </button>
            </div>

            <div className="mt-4 flex">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center bg-blue-600 text-white px-4 py-2 w-full rounded ml-2"
              >
                <MdEdit className="ml-2" />
                تغییر
              </button>
              <button
                onClick={() => {
                  setCategoryToDelete(category._id);
                  setIsDeleteModalOpen(true);
                }}
                className="flex items-center bg-red-600 text-white px-4 py-2 w-full rounded ml-2"
              >
                <MdDelete className="ml-2" />
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* مودال افزودن/تغییر دسته‌بندی */}
      {isCategoryModalOpen && (editingCategory || !editingCategory) && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4">
              {editingCategory ? "تغییر دسته‌بندی" : "افزودن دسته‌بندی جدید"}
            </h2>
            <input
              type="text"
              placeholder="نام دسته‌بندی"
              value={editingCategory ? editingCategory.name : newCategoryName}
              onChange={(e) =>
                editingCategory
                  ? setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  : setNewCategoryName(e.target.value)
              }
              className="border p-2 rounded mb-4 w-full"
            />
            <div className="mb-4">
              <input
                type="file"
                onChange={(e) =>
                  setNewCategoryIcon(e.target.files?.[0] || null)
                }
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                <MdCancel className="mr-2" />
                انصراف
              </button>
              <button
                onClick={
                  editingCategory ? handleEditCategory : handleAddCategory
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={
                  !(
                    (editingCategory && editingCategory.name) ||
                    newCategoryName
                  )
                }
              >
                <MdSave className="mr-2" />
                {editingCategory ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال تایید حذف */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">
              آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                <MdCancel className="mr-2" />
                انصراف
              </button>
              <button
                onClick={
                  categoryToDelete
                    ? handleDeleteCategory
                    : handleDeleteSubcategory
                }
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                <MdDelete className="mr-2" />
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال تغییر زیرگروه */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4">تغییر زیرگروه</h2>
            <input
              type="text"
              value={editingSubcategory ? editingSubcategory.name : ""}
              onChange={(e) =>
                setEditingSubcategory({
                  ...editingSubcategory!,
                  name: e.target.value,
                })
              }
              className="border p-2 rounded mb-4 w-full"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsSubcategoryModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                <MdCancel className="mr-2" />
                انصراف
              </button>
              <button
                onClick={handleEditSubcategory}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                <MdSave className="mr-2" />
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
