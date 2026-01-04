const User = require('../models/User');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const Shop = require('../models/Shop');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalPartners, totalOrders, revenueAgg] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            DeliveryPartner.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { 'paymentInfo.status': 'success' } },
                { $group: { _id: null, total: { $sum: '$grandTotal' } } },
            ]),
        ]);

        const totalRevenue = revenueAgg[0]?.total || 0;

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderId userName grandTotal status createdAt');

        // Get order status breakdown
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalPartners,
                totalOrders,
                totalRevenue,
                usersGrowth: 12.5, // Placeholder - calculate from historical data
                partnersGrowth: 8.2,
                ordersGrowth: 23.4,
                revenueGrowth: 18.7,
            },
            recentOrders,
            ordersByStatus,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;

        const query = { role: 'user' };
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            count: users.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'inactive', 'blocked'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all delivery partners
// @route   GET /api/admin/partners
// @access  Private (Admin)
const getPartners = async (req, res) => {
    try {
        const { status, verified, search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (verified !== undefined) query.documentsVerified = verified === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const partners = await DeliveryPartner.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await DeliveryPartner.countDocuments(query);

        res.json({
            success: true,
            count: partners.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            partners,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify delivery partner documents
// @route   PUT /api/admin/partners/:id/verify
// @access  Private (Admin)
const verifyPartner = async (req, res) => {
    try {
        const { verified } = req.body;

        const partner = await DeliveryPartner.findByIdAndUpdate(
            req.params.id,
            { documentsVerified: verified },
            { new: true }
        ).select('-password');

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        res.json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { shopName: { $regex: search, $options: 'i' } },
            ];
        }

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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Assign delivery partner to order
// @route   PUT /api/admin/orders/:id/assign
// @access  Private (Admin)
const assignDeliveryPartner = async (req, res) => {
    try {
        const { partnerId } = req.body;

        const partner = await DeliveryPartner.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                deliveryPartnerId: partnerId,
                deliveryPartnerName: partner.name,
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update partner status to busy
        await DeliveryPartner.findByIdAndUpdate(partnerId, { status: 'busy' });

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all shops
// @route   GET /api/admin/shops
// @access  Private (Admin)
const getShops = async (req, res) => {
    try {
        const shops = await Shop.find().sort({ totalRevenue: -1 });
        res.json({ success: true, shops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getPartners,
    verifyPartner,
    getAllOrders,
    updateOrderStatus,
    assignDeliveryPartner,
    getShops,
};
