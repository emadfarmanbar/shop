"use client";
import React, { useState } from 'react';
import { FiHome, FiPackage, FiShoppingCart, FiBarChart2, FiClipboard, FiLayers } from 'react-icons/fi'; // افزودن آیکون دسته‌بندی‌ها
import CategoryManager from '../CategoryManager/CategoryManager';
import ProductManager from '../products/page';
import Inventory from '../Inventory/page';
import Orders from '../Orders/page';

const AdminDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('category');

  // کامپوننت منوی کناری
  const Sidebar = () => (
    <div className="w-64 bg-green-600 text-white h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">مدیریت</h2>
      <ul className="flex-1 space-y-4">
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === 'category' ? 'bg-green-700' : 'hover:bg-green-700'
          }`}
          onClick={() => setSelectedSection('category')}
        >
          <FiLayers className="mr-2" /> دسته‌بندی‌ها {/* آیکون دسته‌بندی */}
        </li>
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === 'products' ? 'bg-green-700' : 'hover:bg-green-700'
          }`}
          onClick={() => setSelectedSection('products')}
        >
          <FiPackage className="mr-2" /> کالاها
        </li>
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === 'orders' ? 'bg-green-700' : 'hover:bg-green-700'
          }`}
          onClick={() => setSelectedSection('orders')}
        >
          <FiShoppingCart className="mr-2" /> سفارشات
        </li>
        <li
          className={`flex items-center cursor-pointer py-2 rounded-md ${
            selectedSection === 'inventory' ? 'bg-green-700' : 'hover:bg-green-700'
          }`}
          onClick={() => setSelectedSection('inventory')}
        >
          <FiClipboard className="mr-2" /> موجودی و قیمت
        </li>
      </ul>
      <div className="border-t border-green-400 pt-4 mt-4">
        <p className="text-sm">مدیر</p>
        <p className="text-sm text-green-200">admin@example.com</p>
      </div>
    </div>
  );

  // کامپوننت محتوای هر بخش
  const ContentArea = () => {
    const renderContent = () => {
      switch (selectedSection) {
        case 'category':
          return <CategoryManager />; // بخش دسته‌بندی‌ها
        case 'products':
          return <ProductManager />;
        case 'orders':
          return <Orders />;
        case 'inventory':
          return <Inventory />;
        default:
          return <div className="text-center text-gray-700">لطفاً یک بخش از منو انتخاب کنید.</div>;
      }
    };

    return (
      <div className="flex-1 bg-white p-8">
        <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ContentArea />
    </div>
  );
};

export default AdminDashboard;
