const Razorpay = require('razorpay');

let razorpayInstance = null;

/**
 * Get Razorpay instance with lazy initialization
 * This allows the server to start even if Razorpay credentials are not configured
 */
const getRazorpay = () => {
    if (!razorpayInstance) {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            throw new Error(
                'Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'
            );
        }

        razorpayInstance = new Razorpay({
            key_id,
            key_secret,
        });
    }

    return razorpayInstance;
};

module.exports = { getRazorpay };
