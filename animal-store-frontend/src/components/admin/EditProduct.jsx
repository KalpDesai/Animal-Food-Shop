/* eslint-disable */
// src/components/admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { Trash2, PlusCircle, ArrowLeft, Save } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();

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
    ingredients: [],
    benefits: [],
    feedingInstructions: [],
    shelfLife: "",
    storage: "",
    stock: "",
    isActive: false,
    isFeatured: false,
    tags: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        const data = res.data;
        setProduct({
          ...product,
          ...data,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          benefits: Array.isArray(data.benefits) ? data.benefits : [],
          feedingInstructions: Array.isArray(data.feedingInstructions)
            ? data.feedingInstructions.map((fi) => ({
              type: fi.type ?? "",
              quantity: fi.quantity ?? "",
              _id: fi._id ?? undefined,
            }))
            : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
        setPreview(data.imageUrl ?? data.image ?? "");
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to load product";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "imageUrl") setPreview(value);
  };

  const handleArrayChange = (field, index, value) => {
    setProduct((p) => {
      const arr = [...(p[field] || [])];
      arr[index] = value;
      return { ...p, [field]: arr };
    });
  };
  const addArrayItem = (field) => {
    setProduct((p) => ({ ...p, [field]: [...(p[field] || []), ""] }));
  };
  const removeArrayItem = (field, index) => {
    setProduct((p) => {
      const arr = [...(p[field] || [])];
      arr.splice(index, 1);
      return { ...p, [field]: arr };
    });
  };

  const handleFeedingChange = (index, key, value) => {
    setProduct((p) => {
      const fi = [...(p.feedingInstructions || [])];
      fi[index] = { ...(fi[index] || {}), [key]: value };
      return { ...p, feedingInstructions: fi };
    });
  };

  const addFeedingInstruction = () => {
    setProduct((p) => ({
      ...p,
      feedingInstructions: [...(p.feedingInstructions || []), { type: "", quantity: "" }],
    }));
  };

  const removeFeedingInstruction = (index) => {
    setProduct((p) => {
      const fi = [...(p.feedingInstructions || [])];
      fi.splice(index, 1);
      return { ...p, feedingInstructions: fi };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...product,
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        ingredients: (product.ingredients || []).map((x) => x.trim()),
        benefits: (product.benefits || []).map((x) => x.trim()),
        tags: (product.tags || []).map((x) => x.trim()),
        feedingInstructions: (product.feedingInstructions || []).map((fi) => ({
          type: fi.type ?? "",
          quantity: fi.quantity ?? "",
          ...(fi._id ? { _id: fi._id } : {}),
        })),
      };

      const res = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        payload
      );
      toast.success("Product updated successfully");
      setProduct((p) => ({ ...p, ...res.data }));
      if (res.data.imageUrl) setPreview(res.data.imageUrl);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="p-6 text-center text-gray-600">Loading product...</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Name" name="name" value={product.name} onChange={handleChange} />
            <InputField label="Brand" name="brand" value={product.brand} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Category" name="category" value={product.category} onChange={handleChange} />
            <InputField label="Weight" name="weight" value={product.weight} onChange={handleChange} />
          </div>

          {/* Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <InputField label="Image URL" name="imageUrl" value={product.imageUrl} onChange={handleChange} />
              <p className="text-xs text-gray-500 mt-1">Paste an image URL (Cloudinary recommended).</p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-1">Preview</label>
              <div className="w-32 h-32 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="preview" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField type="number" label="Price" name="price" value={product.price} onChange={handleChange} />
            <InputField type="number" label="Stock" name="stock" value={product.stock} onChange={handleChange} />
            <InputField label="Price Info" name="priceInfo" value={product.priceInfo} onChange={handleChange} />
          </div>

          {/* Arrays */}
          <ArrayField label="Ingredients" values={product.ingredients} onAdd={() => addArrayItem("ingredients")} onRemove={(i) => removeArrayItem("ingredients", i)} onChange={(i, val) => handleArrayChange("ingredients", i, val)} />
          <ArrayField label="Benefits" values={product.benefits} onAdd={() => addArrayItem("benefits")} onRemove={(i) => removeArrayItem("benefits", i)} onChange={(i, val) => handleArrayChange("benefits", i, val)} />
          <ArrayField label="Tags" values={product.tags} onAdd={() => addArrayItem("tags")} onRemove={(i) => removeArrayItem("tags", i)} onChange={(i, val) => handleArrayChange("tags", i, val)} />

          {/* Feeding Instructions */}
          <div>
            <label className="block text-sm font-medium mb-2">Feeding Instructions</label>
            {(product.feedingInstructions || []).map((fi, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  placeholder="Type"
                  value={fi.type}
                  onChange={(e) => handleFeedingChange(idx, "type", e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  placeholder="Quantity"
                  value={fi.quantity}
                  onChange={(e) => handleFeedingChange(idx, "quantity", e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFeedingInstruction(idx)}
                  className="px-2 bg-red-500 text-white rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeedingInstruction}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <PlusCircle size={16} /> Add Instruction
            </button>
          </div>

          {/* Booleans */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" checked={!!product.isActive} onChange={handleChange} />
              <span>Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isFeatured" checked={!!product.isFeatured} onChange={handleChange} />
              <span>Featured</span>
            </label>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
      < AdminFooter />
    </div>
  );
}

/* Helper Components */
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const ArrayField = ({ label, values, onAdd, onRemove, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {values.map((val, idx) => (
      <div key={idx} className="flex gap-2 mb-2">
        <input
          value={val}
          onChange={(e) => onChange(idx, e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="px-2 bg-red-500 text-white rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <PlusCircle size={16} /> Add {label}
    </button>
  </div>

);
