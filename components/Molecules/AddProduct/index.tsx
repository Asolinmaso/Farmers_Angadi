// pages/product/add.tsx

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
        className="bg-white p-8 shadow-md rounded-lg w-full max-w-xl space-y-6"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
          Add New Product
        </h2>

        {/* Product Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Product Name</label>
            <input type="text" name="name" className="input-field" placeholder="Product Name" required />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-600">Category</label>
            <select name="category" className="input-field" required>
              <option value="">Select Category</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Price</label>
            <input type="number" name="cost" className="input-field" placeholder="Price" required />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-600">Discount</label>
            <input type="number" name="discount" className="input-field" placeholder="Discount" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Image</label>
            <input type="file" name="image" className="input-field" required />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-600">Stock</label>
            <input type="number" name="stock" className="input-field" placeholder="Stock" required />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600">Description</label>
          <textarea name="about" className="input-field h-24" placeholder="Describe the product" required />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600">Measurement (Optional)</label>
          <input type="text" name="measurement" className="input-field" placeholder="e.g., Kg, Liter, Pieces" />
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default AddProductForm;
