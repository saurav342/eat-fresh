const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
        name: { type: String, required: true, trim: true },
        description: String,
        weight: { type: String, required: true },
        pieces: String,
        price: { type: Number, required: true },
        originalPrice: Number,
        discount: Number,
        category: { type: String, required: true },
        tags: [{ type: String }],
        isAvailable: { type: Boolean, default: true },
        serves: Number,
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        features: [{ type: String }],
        source: String,
        image: String,
    },
    { timestamps: true }
);

// Index for category filtering
productSchema.index({ category: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Product', productSchema);
