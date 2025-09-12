// controllers/productController.js
const Product = require('../models/Product');

// DO NOT CALL the function here
const getProducts = async (req, res) => {
  console.log('Request to /api/products received');

  try {
    const { category, search, featured, page = 1, limit = 15, sort } = req.query;
    console.log('Query params:', req.query);

    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    else if (featured === 'false') query.isFeatured = false;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    console.log('Total products:', total);

    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'name_asc') sortOption.name = 1;
    else if (sort === 'name_desc') sortOption.name = -1;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    console.log('Products retrieved:', products.length);

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      products
    });

  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category"); // gets unique categories
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/featured
  const getFeaturedProducts = async (req, res) => {
    try {
      const featured = await Product.find({ isFeatured: true });
      res.json(featured);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };


// GET /api/products/:id/related
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(5); // or any number you want

    res.json(related);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
};


// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
};

// POST /api/products/:id/reviews
const addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/products/:id/reviews
const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getFeaturedProducts,
  addReview,
  getProductReviews,
  getCategories,
};
