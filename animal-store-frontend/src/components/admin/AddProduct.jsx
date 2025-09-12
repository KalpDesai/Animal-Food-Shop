/* eslint-disable */
// src/components/admin/AddProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { Loader2 } from "lucide-react"; // nice spinner icon
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  Tag,
  Utensils,
  Star,
  Info,
} from "lucide-react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    imageUrl: "",
    weight: "",
    price: "",
    priceInfo: "",
    flavor: "",
    texture: "",
    ingredients: [""],
    benefits: [""],
    feedingInstructions: [{ type: "", quantity: "" }],
    shelfLife: "",
    storage: "",
    stock: "",
    isActive: true,
    isFeatured: false,
    tags: [""],
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products?limit=1000`
        );
        const data = await res.json();
        const allProducts = data.products || [];

        const uniqueCategories = [
          ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
        ].sort();

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchAllCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, index, value, subField = null) => {
    setProduct((prev) => {
      const arr = [...prev[field]];
      if (subField) {
        arr[index][subField] = value;
      } else {
        arr[index] = value;
      }
      return { ...prev, [field]: arr };
    });
  };

  const addArrayField = (field, newItem) => {
    setProduct((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };

  const removeArrayField = (field, index) => {
    setProduct((prev) => {
      const arr = [...prev[field]];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        product
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Product added successfully!");
        // reset form
        setProduct({
          name: "",
          brand: "",
          category: "",
          imageUrl: "",
          weight: "",
          price: "",
          priceInfo: "",
          flavor: "",
          texture: "",
          ingredients: [""],
          benefits: [""],
          feedingInstructions: [{ type: "", quantity: "" }],
          shelfLife: "",
          storage: "",
          stock: "",
          isActive: true,
          isFeatured: false,
          tags: [""],
        });
      } else {
        toast.error("Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#000",
            fontWeight: "500",
          },
        }}
      />


      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-green-600" />
          Add New Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 shadow-lg rounded-xl"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            {/* Category Dropdown */}
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>

          {product.imageUrl && (
            <div className="flex justify-center">
              <img
                src={product.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="weight"
              value={product.weight}
              onChange={handleChange}
              placeholder="Weight (e.g. 250g)"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              name="priceInfo"
              value={product.priceInfo}
              onChange={handleChange}
              placeholder="Price Info"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              name="flavor"
              value={product.flavor}
              onChange={handleChange}
              placeholder="Flavor"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              name="texture"
              value={product.texture}
              onChange={handleChange}
              placeholder="Texture"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-blue-600" />
              Ingredients
            </label>
            {product.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <input
                  value={ing}
                  onChange={(e) =>
                    handleArrayChange("ingredients", i, e.target.value)
                  }
                  placeholder="Ingredient"
                  className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("ingredients", i)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("ingredients", "")}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Ingredient
            </button>
          </div>

          {/* Benefits */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Benefits
            </label>
            {product.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <input
                  value={b}
                  onChange={(e) =>
                    handleArrayChange("benefits", i, e.target.value)
                  }
                  placeholder="Benefit"
                  className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("benefits", i)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("benefits", "")}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <Plus className="w-4 h-4" /> Add Benefit
            </button>
          </div>

          {/* Feeding Instructions */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-purple-600" />
              Feeding Instructions
            </label>
            {product.feedingInstructions.map((fi, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  value={fi.type}
                  onChange={(e) =>
                    handleArrayChange("feedingInstructions", i, e.target.value, "type")
                  }
                  placeholder="Type"
                  className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-400"
                />
                <input
                  value={fi.quantity}
                  onChange={(e) =>
                    handleArrayChange("feedingInstructions", i, e.target.value, "quantity")
                  }
                  placeholder="Quantity"
                  className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("feedingInstructions", i)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayField("feedingInstructions", { type: "", quantity: "" })
              }
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" /> Add Instruction
            </button>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="shelfLife"
              value={product.shelfLife}
              onChange={handleChange}
              placeholder="Shelf Life"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              name="storage"
              value={product.storage}
              onChange={handleChange}
              placeholder="Storage Instructions"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={product.isActive}
                onChange={handleChange}
                className="accent-green-600"
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={product.isFeatured}
                onChange={handleChange}
                className="accent-yellow-500"
              />
              Featured
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-pink-500" />
              Tags
            </label>
            {product.tags.map((tag, i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <input
                  value={tag}
                  onChange={(e) => handleArrayChange("tags", i, e.target.value)}
                  placeholder="Tag"
                  className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("tags", i)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("tags", "")}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              <Plus className="w-4 h-4" /> Add Tag
            </button>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
      < AdminFooter />
    </div>

  );

}
