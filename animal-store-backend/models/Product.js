const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: String,
    category: String,
    imageUrl: String,
    weight: String,
    price: { type: Number, required: true },
    priceInfo: String,
    flavor: String,
    texture: String,
    ingredients: [String],
    benefits: [String],
    description: String,
    feedingInstructions: [
      {
        type: { type: String },
        quantity: String,
      },
    ],
    shelfLife: String,
    storage: String,
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);

productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Ensure updatedAt updates
  if (!update.$set) update.$set = {};
  update.$set.updatedAt = new Date();

  // Fetch current document to calculate new version
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    let current = doc.__v || 1;
    let [major, minor] = String(current).split(".").map(Number);

    if (!minor) minor = 0;

    // Increment version like 1 → 1.1 → 1.2 → 2.1 → 2.2 …
    if (minor < 9) {
      minor += 1;
    } else {
      major += 1;
      minor = 1;
    }

    update.$set.__v = parseFloat(`${major}.${minor}`);
  }

  next();
});
