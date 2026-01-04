const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        address: { type: String, required: true },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        categories: [{ type: String }],
        timing: { type: String, default: '8 AM - 8 PM' },
        isOpen: { type: Boolean, default: true },
        closingSoon: { type: Boolean, default: false },
        freeDelivery: { type: Boolean, default: false },
        deliveryFee: { type: Number, default: 0 },
        deliveryTime: { type: String, default: '45 mins' },
        image: String,
        location: {
            type: { type: String, default: 'Point' },
            coordinates: [Number], // [longitude, latitude]
        },
        totalOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index for geospatial queries
shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);
