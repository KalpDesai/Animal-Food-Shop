// src/components/SingleProduct.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import { useCart } from "../context/CartContext";
import { Toaster, toast } from "sonner";
import Footer from "./Footer";
import LoaderOverlay from "./LoaderOverlay";

const Star = ({ filled, onClick, onHover, onLeave }) => (
  <span
    onClick={onClick}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    className={`cursor-pointer transition text-2xl ${filled ? "text-black" : "text-gray-300"
      }`}
  >
    ★
  </span>
);

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const username = localStorage.getItem("username") || "User";
  const token = localStorage.getItem("token");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    }
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) {
          toast.error("Product not found");
          return;
        }
        setProduct(data);
        setQuantity(1);
        if (data.category) fetchSimilarProducts(data.category);
        fetchReviews();
      } catch {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarProducts = async (category) => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products?category=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        if (Array.isArray(data.products)) {
          setSimilarProducts(data.products.filter((p) => p._id !== id));
        }
      } catch {
        toast.error("Failed to load similar products");
      }
    };

    fetchProduct();
  }, [id, fetchReviews]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) return toast.error("Out of stock");
    if (quantity > product.stock) return toast.error(`Only ${product.stock} left`);
    const added = addToCart(product, quantity);
    added
      ? toast.success(`Added ${quantity} item(s) to cart`)
      : toast.error("Failed to add to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 300);
  };

  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQty = () => {
    if (product && quantity < product.stock) setQuantity((prev) => prev + 1);
    else toast.error("No more stock available");
  };

  const handleReviewSubmit = async () => {
    if (!reviewComment.trim() || reviewRating < 1 || reviewRating > 5) {
      toast.error("Enter a rating and comment");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Review failed");
      toast.success("Review submitted");
      setReviewComment("");
      setReviewRating(0);
      fetchReviews();
    } catch {
      toast.error("Review submission failed");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
        reviews.reduce((acc, r) => acc + (r?.rating || 0), 0) / reviews.length
      ).toFixed(1)
      : null;

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-lg ${i <= rounded ? "text-black" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <LoaderOverlay show={loading} message="Loading products..." />
    );
  }

  if (!product)
    return <p className="text-center mt-10 text-red-500">Product not found</p>;

  return (
    <>
      <Toaster position="top-center" />
      <UserNavbar username={username} />

      <div className="max-w-6x5 mx-auto p-6 mt-8">
        {/* Back */}
        <button
          className="mb-6 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-sm rounded-md"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Product Section */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image */}
          <div className="md:w-1/2 rounded-md border border-gray-200 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover hover:scale-105 transition-transform"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            {averageRating && (
              <div className="flex items-center gap-2">
                {renderStars(averageRating)}
                <span className="text-sm text-gray-500">
                  {averageRating} / 5 ({reviews.length})
                </span>
              </div>
            )}

            <p className="text-xl font-bold">₹{product.price}</p>

            <p className="text-gray-600">
              <span className="font-medium">Flavor:</span> {product.flavor}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Weight:</span> {product.weight}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Stock:</span>{" "}
              {product.stock > 0 ? (
                `${product.stock} available`
              ) : (
                <span className="text-red-500 font-medium">Out of stock</span>
              )}
            </p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2 border px-3 py-1 rounded-md bg-white">
                  <button onClick={decreaseQty} className="text-lg font-bold">
                    −
                  </button>
                  <span className="px-2">{quantity}</span>
                  <button onClick={increaseQty} className="text-lg font-bold">
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-4 flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="px-6 py-2 rounded-md bg-black hover:bg-gray-800 text-white"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 space-y-6">
          <h2 className="text-lg font-medium mb-2">Product Details</h2>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Ingredients</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {product.benefits?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Benefits</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {product.benefits.map((ben, idx) => (
                  <li key={idx}>{ben}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Feeding Instructions */}
          {product.feedingInstructions?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Feeding Instructions</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {product.feedingInstructions.map((fi) => (
                  <li key={fi._id}>
                    <span className="font-medium">{fi.type}:</span> {fi.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shelf Life & Storage */}
          {(product.shelfLife || product.storage) && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Storage & Shelf Life</h3>
              {product.shelfLife && (
                <p className="text-gray-600">
                  <span className="font-medium">Shelf Life:</span> {product.shelfLife}
                </p>
              )}
              {product.storage && (
                <p className="text-gray-600">
                  <span className="font-medium">Storage:</span> {product.storage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-14">
          <h2 className="text-xl font-medium mb-4">Reviews & Ratings</h2>

          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-white">
            <textarea
              rows={3}
              className="w-full p-3 border rounded-md mb-3"
              placeholder="Write your review..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((r) => (
                <Star
                  key={r}
                  filled={r <= (hoverRating || reviewRating)}
                  onClick={() => setReviewRating(r)}
                  onHover={() => setHoverRating(r)}
                  onLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <button
              onClick={handleReviewSubmit}
              className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Submit Review
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div
                  key={review._id || i}
                  className="p-4 border border-gray-200 rounded-md bg-white"
                >
                  <div className="mb-1">{renderStars(review.rating)}</div>
                  <p className="text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    By: {review.name || review.user?.name || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-medium mb-4">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {similarProducts.map((sp) => (
                <div
                  key={sp._id}
                  className="p-4 border border-gray-200 rounded-md bg-white hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/product/${sp._id}`)}
                >
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    className="w-full h-44 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-medium">{sp.name}</h3>
                  <p className="text-sm text-gray-600">₹{sp.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SingleProduct;
