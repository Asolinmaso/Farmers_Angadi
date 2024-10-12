// pages/product/add.tsx

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
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product created successfully!");
        event.currentTarget.reset(); // Clear the form
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">
          Add New Product
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              className="custom-input"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select name="category" className="custom-input" required>
              <option value="">Select Category</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="cost"
                className="custom-input"
                placeholder="Enter price"
                required
              />
            </div>

            {/* Discount */}
            <div>
              <label className="text-sm font-medium text-gray-700">Discount</label>
              <input
                type="number"
                name="discount"
                className="custom-input"
                placeholder="Enter discount"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                name="image"
                className="custom-input"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                className="custom-input"
                placeholder="Enter stock quantity"
                required
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="about"
              className="custom-input h-28"
              placeholder="Describe the product"
              required
            ></textarea>
          </div>

          {/* Measurement */}
          <div>
            <label className="text-sm font-medium text-gray-700">Measurement (Optional)</label>
            <input
              type="text"
              name="measurement"
              className="custom-input"
              placeholder="e.g., Kg, Liter, Pieces"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn-primary ${isSubmitting ? "opacity-50" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Product"}
          </button>

          {/* Success/Error Message */}
          {message && (
            <p className="text-center text-lg font-semibold text-green-600 mt-4">
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
