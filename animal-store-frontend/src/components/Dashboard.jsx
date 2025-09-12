// src/components/Dashboard.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";
import TypingEffect from "./TypingEffect";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import LoaderOverlay from "./LoaderOverlay";
import { Toaster, toast } from "sonner";
import { useCart } from "../context/CartContext"; // Uses CartContext - ensure this exists

// Load Inter font (only once)
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // addToCart(product, qty)
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters / pagination
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const username = localStorage.getItem("username") || "User";

  // fetch products & attach ratings (reviews_count + rating)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/products?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}&category=${encodeURIComponent(categoryFilter)}&sort=${sortOrder === "lowToHigh" ? "price_asc" : sortOrder === "highToLow" ? "price_desc" : ""
        }&t=${Date.now()}`;

      const res = await fetch(url);
      const data = await res.json();

      const rawList = Array.isArray(data.products) ? data.products : [];

      // fetch reviews for each product in parallel and compute average
      const withRatings = await Promise.all(
        rawList.map(async (p) => {
          try {
            const r = await fetch(`${API_BASE}/products/${p._id}/reviews`);
            const reviews = await r.json();
            if (Array.isArray(reviews) && reviews.length > 0) {
              const avg = reviews.reduce((s, v) => s + (v.rating || 0), 0) / reviews.length;
              return { ...p, rating: avg, reviews_count: reviews.length };
            }
            return { ...p, rating: 0, reviews_count: 0 };
          } catch {
            return { ...p, rating: 0, reviews_count: 0 };
          }
        })
      );

      setProducts(withRatings);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const r = await fetch(`${API_BASE}/products/categories`);
        const d = await r.json();
        setCategories(d.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  // featured
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const r = await fetch(`${API_BASE}/products/featured`);
        const d = await r.json();
        // optionally attach ratings to featured as well
        const list = Array.isArray(d) ? d : (d.products || []);
        const withRatings = await Promise.all(
          list.map(async (p) => {
            try {
              const rr = await fetch(`${API_BASE}/products/${p._id}/reviews`);
              const rv = await rr.json();
              if (Array.isArray(rv) && rv.length) {
                const avg = rv.reduce((s, v) => s + (v.rating || 0), 0) / rv.length;
                return { ...p, rating: avg, reviews_count: rv.length };
              }
              return { ...p, rating: 0, reviews_count: 0 };
            } catch {
              return { ...p, rating: 0, reviews_count: 0 };
            }
          })
        );
        setFeaturedProducts(withRatings);
      } catch (err) {
        console.error("Failed to load featured products", err);
      }
    };
    loadFeatured();
  }, []);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setSortOrder("");
    setPage(1);
  };

  // Add to cart that actually updates your cart via context
  const handleAddToCart = (product, qty = 1, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!product || (product.stock === 0)) {
      toast.error("Out of stock");
      return;
    }

    try {
      if (typeof addToCart === "function") {
        addToCart(product, qty);
        toast.success(`${product.name} added to cart`);
      } else {
        // fallback: store in localStorage cart (simple)
        const key = "cart_v1";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const foundIdx = existing.findIndex((it) => it._id === product._id);
        if (foundIdx >= 0) {
          existing[foundIdx].quantity = (existing[foundIdx].quantity || 1) + qty;
        } else {
          existing.push({ ...product, quantity: qty });
        }
        localStorage.setItem(key, JSON.stringify(existing));
        toast.success(`${product.name} added to cart (local)`);
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Failed to add to cart");
    }
  };

  // page numbers (show up to 7 pages with truncation)
  const getPageArray = (current, total) => {
    const maxButtons = 7;
    if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set();
    pages.add(1);
    pages.add(total);
    pages.add(current);

    for (let i = 1; i <= 2; i++) {
      if (current - i > 1) pages.add(current - i);
      if (current + i < total) pages.add(current + i);
    }

    const sorted = Array.from(pages).sort((a, b) => a - b);
    return sorted;
  };

  const visibleProducts = useMemo(() => products, [products]);

  return (
    <>
      {/* Toaster at top-center */}
      <Toaster position="top-center" />

      <UserNavbar username={username} />

      {/* Full-width main */}
      <main className="w-full min-h-screen bg-neutral-50 px-6 lg:px-12 py-8 font-sans text-neutral-900">
        {/* Header (full width) */}
        <header className="w-full mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
                <AdjustmentsHorizontalIcon className="h-8 w-8 text-neutral-900" />
                <span>Shop for Pets</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1 max-w-2xl">
                <TypingEffect
                  sentences={[
                    "Fresh & healthy food for cats, dogs, birds",
                    "Top brands, best deals, delivered fast",
                    "Secure checkout & easy returns",
                  ]}
                />
              </p>
            </div>

            {/* prominent search */}
            <div className="w-full md:w-1/3">
              <label htmlFor="site-search" className="sr-only">Search products</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-3" />
                <input
                  id="site-search"
                  type="search"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products, brands, flavors..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            </div>
          </div>
        </header>

        {/* layout: sidebar + content (full width) */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - 2 cols on large */}
          <aside className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Filters</h3>
                <button onClick={resetFilters} className="text-sm text-neutral-500 hover:text-neutral-900">Reset</button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="w-full rounded-md border border-neutral-300 p-2 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Sort</label>
                <select
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                  className="w-full rounded-md border border-neutral-300 p-2 bg-white"
                >
                  <option value="">Relevance</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main content - 10 cols on large */}
          <div className="lg:col-span-10 order-1 lg:order-2 w-full">
            {/* Featured row - full width */}
            {featuredProducts?.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-6 border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Featured</h3>
                  <button onClick={() => navigate("/products")} className="text-sm text-neutral-600 hover:text-neutral-900">View all</button>
                </div>

                <div className="overflow-x-auto">
                  <div className="flex gap-4 py-2">
                    {featuredProducts.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => navigate(`/product/${p._id}`)}
                        className="w-60 bg-white rounded-lg p-3 border border-neutral-200 hover:shadow-md transition cursor-pointer flex-shrink-0"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") navigate(`/product/${p._id}`); }}
                      >
                        <div className="h-36 mb-2 overflow-hidden rounded-md">
                          <img src={p.imageUrl || "https://via.placeholder.com/300"} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm font-medium text-neutral-900 truncate">{p.name}</div>
                        <div className="text-xs text-neutral-500">₹{p.price}</div>
                        <div className="mt-2 text-xs text-neutral-600">{p.reviews_count ? `${p.rating?.toFixed(1)} • ${p.reviews_count} reviews` : "No reviews"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products grid (4 per row on large) */}
            <LoaderOverlay show={loading} message="Loading products..." />
            {!loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                  {visibleProducts.map((product) => (
                    <article
                      key={product._id}
                      className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                    >
                      {/* clicking the card opens product page */}
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => navigate(`/product/${product._id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") navigate(`/product/${product._id}`); }}
                      >
                        <div className="h-52 overflow-hidden bg-neutral-100">
                          <img
                            src={product.imageUrl || "https://via.placeholder.com/600x400"}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* badges */}
                        {product.discount && (
                          <div className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2 py-1 rounded">-{product.discount}%</div>
                        )}
                        {!product.stock || product.stock === 0 ? (
                          <div className="absolute top-3 right-3 bg-neutral-800 text-white text-xs font-semibold px-2 py-1 rounded">Out</div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-neutral-100 text-neutral-700 text-xs font-semibold px-2 py-1 rounded">In stock</div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h3>
                            <p className="text-xs text-neutral-500 mt-1 truncate">{product.flavor || product.category}</p>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-semibold text-neutral-900">₹{product.price}</div>
                            {product.oldPrice && <div className="text-xs text-neutral-500 line-through">₹{product.oldPrice}</div>}
                          </div>
                        </div>

                        {/* rating */}
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                                fill={i < Math.round(product.rating || 0) ? "#111111" : "none"}
                                stroke="#111111" className="inline-block">
                                <path strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs">({product.reviews_count || 0})</span>
                        </div>

                        {/* actions: 2 equal columns so both buttons are visible */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => handleAddToCart(product, 1, e)}
                            disabled={!product.stock || product.stock === 0}
                            aria-label={`Add ${product.name} to cart`}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm py-2 px-3 rounded-md shadow-sm transition disabled:opacity-50"
                          >
                            Add to cart
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                            aria-label={`View ${product.name}`}
                            className="border border-neutral-300 text-sm px-3 py-2 rounded-md hover:bg-neutral-50"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* pagination (centered) */}
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {getPageArray(page, totalPages).map((num, idx, arr) => {
                    // show ellipsis where gap > 1
                    const showEllipsis = idx > 0 && num - arr[idx - 1] > 1;
                    return (
                      <React.Fragment key={num + "-" + idx}>
                        {showEllipsis && <span className="px-2">…</span>}
                        <button
                          onClick={() => setPage(num)}
                          className={`px-3 py-1 text-sm border rounded ${page === num ? "bg-neutral-900 text-white" : "bg-white text-neutral-800 hover:bg-neutral-100"}`}
                        >
                          {num}
                        </button>
                      </React.Fragment>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}


