const Order = require('../models/Order');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { getRazorpay } = require('../config/razorpay');
const crypto = require('crypto');
const { generateOrderId, calculateOrderTotals } = require('../utils/helpers');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, shopId, shopName, deliveryFee = 0 } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        const user = await User.findById(req.user.id);

        // Calculate totals
        const totals = calculateOrderTotals(items, deliveryFee);

        // Create order
        const order = await Order.create({
            orderId: generateOrderId(),
            userId: req.user.id,
            userName: user.name,
            userPhone: user.phone,
            items,
            deliveryAddress,
            shopId,
            shopName,
            ...totals,
            paymentInfo: { status: 'pending' },
        });

        // Update user stats
        user.totalOrders += 1;
        user.totalSpent += totals.grandTotal;
        user.lastOrderAt = new Date();
        await user.save();

        // Update shop stats
        await Shop.findByIdAndUpdate(shopId, {
            $inc: { totalOrders: 1, totalRevenue: totals.grandTotal },
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { userId: req.user.id };
        if (status) query.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            orders,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get order by orderId
// @route   GET /api/orders/track/:orderId
// @access  Private
const trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
            userId: req.user.id,
        }).populate('deliveryPartnerId', 'name phone currentLocation');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: orderId,
        };

        const razorpay = getRazorpay();
        const razorpayOrder = await razorpay.orders.create(options);

        res.json({
            success: true,
            order: razorpayOrder,
            key_id: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        // Update order
        const order = await Order.findOneAndUpdate(
            { orderId },
            {
                'paymentInfo.razorpay_order_id': razorpay_order_id,
                'paymentInfo.razorpay_payment_id': razorpay_payment_id,
                'paymentInfo.razorpay_signature': razorpay_signature,
                'paymentInfo.status': 'success',
                status: 'confirmed',
            },
            { new: true }
        );

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (['delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    trackOrder,
    createRazorpayOrder,
    verifyPayment,
    cancelOrder,
};
