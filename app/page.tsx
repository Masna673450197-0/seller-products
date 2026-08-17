'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { productsData } from '@/data/products';
import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 4;

export default function ProductFinderPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. ดึงค่าจาก Query String
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const rawPageParam = searchParams.get('page') || '1';

  // State สำหรับ Form Inputs
  const [search, setSearch] = useState(searchParam);
  const [category, setCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // Sync Form State กับ URL เมื่อ URL มีการเปลี่ยน
  useEffect(() => {
    setSearch(searchParam);
    setCategory(categoryParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [searchParam, categoryParam, minPriceParam, maxPriceParam]);

  // 2. กรองข้อมูลสินค้าตามเงื่อนไข (Search, Category, Min/Max Price)
  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchParam.toLowerCase());
    const matchesCategory = categoryParam ? product.category === categoryParam : true;
    
    const min = minPriceParam ? parseFloat(minPriceParam) : 0;
    const max = maxPriceParam ? parseFloat(maxPriceParam) : Infinity;
    
    const matchesMinPrice = isNaN(min) ? true : product.price >= min;
    const matchesMaxPrice = isNaN(max) ? true : product.price <= max;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  // 3. จัดการ Pagination & Edge Cases (?page=-5, ?page=abc, page เกิน)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  
  let currentPage = parseInt(rawPageParam, 10);
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1; // ดักจับ ?page=-5 หรือ ?page=abc ให้กลับไปหน้า 1
  } else if (currentPage > totalPages) {
    currentPage = totalPages; // ดักจับกรณี ?page เกินจำนวนหน้าจริง ให้ไปหน้าที่มากที่สุด
  }

  // ดึงรายการสินค้าเฉพาะของหน้านั้นๆ
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 4. ฟังก์ชันอัปเดต Query String ใน URL
  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // ปุ่ม Submit ฟอร์มค้นหา (รีเซ็ตกลับไปหน้า 1 เสมอเมื่อกรองใหม่)
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({
      search,
      category,
      minPrice,
      maxPrice,
      page: '1',
    });
  };

  // ปุ่ม Clear Filter
  const handleReset = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  // เปลี่ยนหน้า Previous / Next
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage.toString() });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🔍 Product Finder</h1>

      {/* Form กรองข้อมูล */}
      <form onSubmit={handleFilterSubmit} className="bg-white p-5 rounded-xl shadow-sm border mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ค้นหาชื่อ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
            <input
              type="text"
              placeholder="เช่น Laptop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* ราคาต่ำสุด */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคาต่ำสุด (บาท)</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ราคาสูงสุด */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคาสูงสุด (บาท)</label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            ล้างตัวกรอง
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            ค้นหา
          </button>
        </div>
      </form>

      {/* รายการสินค้า */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <h3 className="font-bold text-gray-800 mt-2">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-1">฿{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border">
          ไม่พบสินค้าที่ตรงตามเงื่อนไข
        </div>
      )}

      {/* ปุ่ม Pagination (Previous / Next) */}
      <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-xl border">
        <span className="text-sm text-gray-600">
          หน้า <span className="font-semibold">{currentPage}</span> จาก <span className="font-semibold">{totalPages}</span> (พบสินค้าทั้งหมด {filteredProducts.length} รายการ)
        </span>

        <div className="flex space-x-2">
          {/* ปุ่ม Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-4 py-2 text-sm rounded-lg font-medium border transition ${
              currentPage <= 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            ← ถอยกลับ (Previous)
          </button>

          {/* ปุ่ม Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 text-sm rounded-lg font-medium border transition ${
              currentPage >= totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            ถัดไป (Next) →
          </button>
        </div>
      </div>
    </div>
  );
}