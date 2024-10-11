"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import MiniProductCard from "@/components/Atoms/miniProductCard";
import axios from "axios";

const AllCategoryListed = () => {
  const [productData, setProductData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `/api/product?category=${selectedCategory}`
          : "/api/product";
        const response = await axios.get(url);

        if (response.data && response.data.data) {
          setProductData(response.data.data);
        } else {
          setProductData([]); // Clear products if no results
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const categories = ["Fruits", "Vegetables"]; // Example categories

  return (
    <div className="product-list-container max-w-7xl mx-auto px-4 py-8">
      {/* Category Buttons */}
      <div className="categories-filter flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-300 ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-xl text-gray-600">Loading products...</p>
      ) : (
        <>
          {productData.length === 0 ? (
            <p className="text-center text-xl text-gray-600">
              No products found in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productData.map((product) => (
                <div key={product._id} className="flex flex-col gap-6">
                  <MiniProductCard
                    data={product}
                    key={product._id}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllCategoryListed;
