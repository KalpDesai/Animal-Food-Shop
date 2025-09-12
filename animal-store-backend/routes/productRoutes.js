const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getRelatedProducts,getFeaturedProducts, addReview, getProductReviews, getCategories } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// handler must be a function, not undefined or result of a function
router.get('/', getProducts);
router.get("/categories", getCategories); // new categories API
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/:id/reviews' , authMiddleware, addReview);
// Fetch all reviews for a product
router.get('/:id/reviews', getProductReviews);

module.exports = router;
