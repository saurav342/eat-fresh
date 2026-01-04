const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: String,
});

const deliveryAddressSchema = new mongoose.Schema({
    label: { type: String, required: true },
    address: { type: String, required: true },
    isDefault: Boolean,
    lat: Number,
    lng: Number,
});

const paymentInfoSchema = new mongoose.Schema({
    razorpay_payment_id: String,
    razorpay_order_id: String,
    razorpay_signature: String,
    method: String,
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
});

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userName: String,
        userPhone: String,
        items: [cartItemSchema],
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
            default: 'pending',
        },
        deliveryAddress: deliveryAddressSchema,
        itemTotal: { type: Number, required: true },
        deliveryFee: { type: Number, default: 0 },
        taxes: { type: Number, default: 0 },
        grandTotal: { type: Number, required: true },
        paymentInfo: paymentInfoSchema,
        estimatedDelivery: String,
        deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner' },
        deliveryPartnerName: String,
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
        shopName: String,
    },
    { timestamps: true }
);

// Indexes for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ deliveryPartnerId: 1, status: 1 });
orderSchema.index({ status: 1 });
// Note: orderId already has an index from unique: true in the schema definition

module.exports = mongoose.model('Order', orderSchema);
