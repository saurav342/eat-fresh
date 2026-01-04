const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateStatus,
    updateLocation,
    getAssignedOrders,
    updateOrderStatus,
    getEarnings,
} = require('../controllers/deliveryController');
const { protectDelivery } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (Delivery Partner only)
router.get('/profile', protectDelivery, getProfile);
router.put('/status', protectDelivery, updateStatus);
router.put('/location', protectDelivery, updateLocation);
router.get('/orders', protectDelivery, getAssignedOrders);
router.put('/orders/:id/status', protectDelivery, updateOrderStatus);
router.get('/earnings', protectDelivery, getEarnings);

module.exports = router;
