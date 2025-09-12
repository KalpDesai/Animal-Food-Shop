// src/components/CategoryProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import UserNavbar from "./UserNavbar";
import LoaderOverlay from "./LoaderOverlay";
import Footer from "./Footer";
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function CategoryProducts() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(category || "");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const username = JSON.parse(localStorage.getItem("user"))?.name || "User";

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products?limit=1000`);
        const data = await res.json();
        const uniqueCategories = [
          ...new Set(data.products.map((p) => p.category).filter(Boolean)),
        ].sort();
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = categoryFilter
          ? `http://localhost:5000/api/products?category=${encodeURIComponent(categoryFilter)}&limit=100`
          : `http://localhost:5000/api/products?limit=100`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
        setFeaturedProducts(data.products?.slice(0, 5) || []);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  // Filter + sort
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch("");
    setSortOrder("");
    setCategoryFilter("");
    setPage(1);
  };

  const handleAddToCart = (product, qty = 1, e) => {
    e.stopPropagation();
    toast.success(`${product.name} added to cart`);
    // your cart logic goes here
  };

  const getPageArray = (current, total) => {
    let pages = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <>
      {/* Toaster */}
      <Toaster position="top-center" />

      <UserNavbar username={username} />

      <main className="w-full min-h-screen bg-neutral-50 px-6 lg:px-12 py-8 font-sans text-neutral-900">
        {/* Header */}
        <header className="w-full mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
              <AdjustmentsHorizontalIcon className="h-8 w-8 text-neutral-900" />
              <span>{categoryFilter || "All Products"}</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Browse products for your pets
            </p>
          </div>

          {/* search */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-3" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>
          </div>
        </header>

        {/* layout */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
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
                  <option value="">All</option>
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

          {/* Main content */}
          <div className="lg:col-span-10 order-1 lg:order-2 w-full">
            {/* Featured */}
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

            {/* Products grid */}
            <LoaderOverlay show={loading} message="Loading products..." />
            {!loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                  {visibleProducts.map((product) => (
                    <article key={product._id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
                      {/* click card → product page */}
                      <div className="relative group cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                        <div className="h-52 overflow-hidden bg-neutral-100">
                          <img src={product.imageUrl || "https://via.placeholder.com/600x400"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        {!product.stock ? (
                          <div className="absolute top-3 right-3 bg-neutral-800 text-white text-xs font-semibold px-2 py-1 rounded">Out</div>
                        ) : (
                          <div className="absolute top-3 right-3 bg-neutral-100 text-neutral-700 text-xs font-semibold px-2 py-1 rounded">In stock</div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h3>
                            <p className="text-xs text-neutral-500 mt-1 truncate">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-neutral-900">₹{product.price}</div>
                          </div>
                        </div>

                        {/* rating */}
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                                fill={i < Math.round(product.rating || 0) ? "#111111" : "none"}
                                stroke="#111111">
                                <path strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs">({product.reviews_count || 0})</span>
                        </div>

                        {/* actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => handleAddToCart(product, 1, e)}
                            disabled={!product.stock}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm py-2 px-3 rounded-md shadow-sm transition disabled:opacity-50"
                          >
                            Add to cart
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                            className="border border-neutral-300 text-sm px-3 py-2 rounded-md hover:bg-neutral-50"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* pagination */}
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Prev</button>
                  {getPageArray(page, totalPages).map((num, idx, arr) => {
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
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
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
