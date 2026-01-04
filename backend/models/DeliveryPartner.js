const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const documentSchema = new mongoose.Schema({
    type: { type: String, enum: ['aadhar', 'pan', 'dl', 'rc'], required: true },
    name: { type: String, required: true },
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
    fileUrl: String,
});

const bankDetailsSchema = new mongoose.Schema({
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String,
});

const deliveryPartnerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        avatar: String,
        status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline' },
        vehicleType: { type: String, enum: ['bike', 'scooter', 'car'], required: true },
        vehicleNumber: { type: String, required: true },
        documents: [documentSchema],
        documentsVerified: { type: Boolean, default: false },
        bankDetails: bankDetailsSchema,
        currentLocation: {
            lat: Number,
            lng: Number,
        },
        rating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        totalDeliveries: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        todayEarnings: { type: Number, default: 0 },
        todayDeliveries: { type: Number, default: 0 },
        weeklyEarnings: { type: Number, default: 0 },
        monthlyEarnings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Hash password before saving
deliveryPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
deliveryPartnerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
deliveryPartnerSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'eatfresh_secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
