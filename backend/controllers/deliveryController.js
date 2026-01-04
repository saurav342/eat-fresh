const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');

// @desc    Register delivery partner
// @route   POST /api/delivery/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, phone, email, password, vehicleType, vehicleNumber } = req.body;

        // Check if partner exists
        const existingPartner = await DeliveryPartner.findOne({ $or: [{ email }, { phone }] });
        if (existingPartner) {
            return res.status(400).json({
                success: false,
                message: 'Partner with this email or phone already exists',
            });
        }

        // Create partner
        const partner = await DeliveryPartner.create({
            name,
            phone,
            email,
            password,
            vehicleType,
            vehicleNumber,
        });

        const token = partner.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            partner: {
                id: partner._id,
                name: partner.name,
                email: partner.email,
                phone: partner.phone,
                vehicleType: partner.vehicleType,
                status: partner.status,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login delivery partner
// @route   POST /api/delivery/login
// @access  Public
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Please provide phone and password' });
        }

        const partner = await DeliveryPartner.findOne({ phone });
        if (!partner) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await partner.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = partner.getSignedJwtToken();

        res.json({
            success: true,
            token,
            partner: {
                id: partner._id,
                name: partner.name,
                email: partner.email,
                phone: partner.phone,
                vehicleType: partner.vehicleType,
                status: partner.status,
                documentsVerified: partner.documentsVerified,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get delivery partner profile
// @route   GET /api/delivery/profile
// @access  Private (Delivery Partner)
const getProfile = async (req, res) => {
    try {
        const partner = await DeliveryPartner.findById(req.partner.id).select('-password');
        res.json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update status (online/offline/busy)
// @route   PUT /api/delivery/status
// @access  Private (Delivery Partner)
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['online', 'offline', 'busy'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const partner = await DeliveryPartner.findByIdAndUpdate(
            req.partner.id,
            { status },
            { new: true }
        ).select('-password');

        res.json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update location
// @route   PUT /api/delivery/location
// @access  Private (Delivery Partner)
const updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        const partner = await DeliveryPartner.findByIdAndUpdate(
            req.partner.id,
            { currentLocation: { lat, lng } },
            { new: true }
        ).select('-password');

        res.json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get assigned orders
// @route   GET /api/delivery/orders
// @access  Private (Delivery Partner)
const getAssignedOrders = async (req, res) => {
    try {
        const { status } = req.query;

        const query = { deliveryPartnerId: req.partner.id };
        if (status) query.status = status;

        const orders = await Order.find(query).sort({ createdAt: -1 });

        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/delivery/orders/:id/status
// @access  Private (Delivery Partner)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['out_for_delivery', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status for delivery partner' });
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, deliveryPartnerId: req.partner.id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update earnings if delivered
        if (status === 'delivered') {
            const deliveryEarning = 50; // Base delivery earning
            await DeliveryPartner.findByIdAndUpdate(req.partner.id, {
                $inc: {
                    totalDeliveries: 1,
                    totalEarnings: deliveryEarning,
                    todayDeliveries: 1,
                    todayEarnings: deliveryEarning,
                    weeklyEarnings: deliveryEarning,
                    monthlyEarnings: deliveryEarning,
                },
            });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get earnings summary
// @route   GET /api/delivery/earnings
// @access  Private (Delivery Partner)
const getEarnings = async (req, res) => {
    try {
        const partner = await DeliveryPartner.findById(req.partner.id).select(
            'totalEarnings todayEarnings weeklyEarnings monthlyEarnings totalDeliveries todayDeliveries'
        );

        res.json({ success: true, earnings: partner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateStatus,
    updateLocation,
    getAssignedOrders,
    updateOrderStatus,
    getEarnings,
};
