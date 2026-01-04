const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists',
            });
        }

        // Create user
        const user = await User.create({ name, email, phone, password });

        // Generate token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Please provide phone and password' });
        }

        // Find user
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check status
        if (user.status === 'blocked') {
            return res.status(403).json({ success: false, message: 'Account is blocked' });
        }

        // Generate token
        const token = user.getSignedJwtToken();

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send OTP (mock implementation)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Please provide phone number' });
        }

        // In production, integrate with SMS provider (Twilio, MSG91, etc.)
        // For now, we'll just return success with a mock OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // In production, store OTP in Redis with expiry
        console.log(`OTP for ${phone}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent successfully',
            // Remove this in production
            otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide phone and OTP' });
        }

        // In production, verify OTP from Redis
        // For now, accept any 4-digit OTP in development
        if (process.env.NODE_ENV !== 'development' && otp !== '1234') {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Find or create user
        let user = await User.findOne({ phone });

        if (!user) {
            // Create new user with phone
            user = await User.create({
                name: 'User',
                phone,
                email: `${phone}@eatfresh.temp`,
                password: Math.random().toString(36).slice(-8),
            });
        }

        const token = user.getSignedJwtToken();

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, sendOtp, verifyOtp, getMe };
