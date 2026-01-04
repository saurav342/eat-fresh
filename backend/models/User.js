const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const addressSchema = new mongoose.Schema({
    label: { type: String, required: true },
    address: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    lat: Number,
    lng: Number,
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        avatar: String,
        addresses: [addressSchema],
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
        totalOrders: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        lastOrderAt: Date,
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'eatfresh_secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

module.exports = mongoose.model('User', userSchema);
