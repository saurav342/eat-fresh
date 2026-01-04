const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    trackOrder,
    createRazorpayOrder,
    verifyPayment,
    cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.route('/').get(getOrders).post(createOrder);
router.get('/track/:orderId', trackOrder);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.post('/create-razorpay', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router;
