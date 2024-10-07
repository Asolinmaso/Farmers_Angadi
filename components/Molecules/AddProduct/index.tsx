"use client";

import { FormEvent, useState } from "react";

const AddProductForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        body: formData, // Send formData directly (includes file upload)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product created successfully!");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error submitting product.");
      console.error("Submission Error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="bg-white p-8 shadow-md rounded-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Add Product
        </h2>

        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            className="text-lg w-full border border-gray-300 h-12 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Eg: Tomato"
            required
          />
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Price
          </label>
          <input
            type="number"
            name="cost"
            className="text-lg w-full border border-gray-300 h-12 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Eg: 50"
            required
          />
        </div>

        {/* Product Discount */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Discount
          </label>
          <input
            type="number"
            name="discount"
            className="text-lg w-full border border-gray-300 h-12 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Eg: 10"
          />
        </div>

        {/* Product Image */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            className="w-full border border-gray-300 h-12 px-4 py-2 rounded-lg"
            required
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Description
          </label>
          <textarea
            name="about"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe the product..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-all ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {/* Display message */}
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AddProductForm;
