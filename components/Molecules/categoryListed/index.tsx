"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import MiniProductCard from "@/components/Atoms/miniProductCard";
import axios from "axios";

const AllCategoryListed = () => {
  const [productData, setProductData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        if (response.data && response.data.data) {
          setProductData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Render the product list
  if (loading) {
    return <p>Loading products...</p>;
  }

  if (productData.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="product-list-container max-w-7xl mx-auto px-4 py-8">
      {productData.map((category) => (
        <div key={category._id} className="flex flex-col mt-12 gap-6">
          <h1 className="text-3xl font-bold capitalize text-primary text-center sm:text-start">
            {category.name}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 py-6">
            
              <MiniProductCard
                data={category}
                uniqueIdentifier={category.name.toLowerCase()}
                key={category._id}
              />
        
          </div>
          <div className="flex justify-center sm:justify-end">
            <Link
              href={`/products/${category._id}`}
              className="py-3 px-6 bg-tertiary flex items-center gap-4 hover:bg-primary hover:text-tertiary transition-colors duration-300 border border-secondary hover:border-primary rounded-lg"
            >
              <p>View More</p>
              <BiRightArrowAlt className="text-xl" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllCategoryListed;
