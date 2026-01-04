const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getPartners,
    verifyPartner,
    getAllOrders,
    updateOrderStatus,
    assignDeliveryPartner,
    getShops,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect); // All routes require authentication
router.use(admin); // All routes require admin role

router.get('/dashboard', getDashboardStats);

router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

router.get('/partners', getPartners);
router.put('/partners/:id/verify', verifyPartner);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/assign', assignDeliveryPartner);

router.get('/shops', getShops);

module.exports = router;
