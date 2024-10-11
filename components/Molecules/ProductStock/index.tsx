// pages/product/stock.tsx

import { FormEvent, useState } from "react";

const StockMeasurementForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/product/stock?categoryId=${formData.get("categoryId")}`, {
        method: "PUT",
        body: JSON.stringify({
          stock: formData.get("stock"),
          measurement: formData.get("measurement"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Stock updated successfully!");
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error updating stock.");
      console.error("Submission Error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 shadow-md rounded-lg w-full max-w-xl space-y-6"
      >
        <h2 className="text-xl font-bold text-center text-gray-700 mb-4">
          Update Stock Measurement
        </h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-600">Product ID</label>
          <input type="text" name="categoryId" className="input-field" placeholder="Product ID" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Stock</label>
            <input type="number" name="stock" className="input-field" placeholder="Stock" required />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-600">Measurement</label>
            <input type="text" name="measurement" className="input-field" placeholder="e.g., Kg, Liter, Pieces" required />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default StockMeasurementForm;
