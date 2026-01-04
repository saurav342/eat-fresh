const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                addresses: user.addresses,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
    try {
        const { label, address, isDefault, lat, lng } = req.body;

        const user = await User.findById(req.user.id);

        // If setting as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        user.addresses.push({ label, address, isDefault, lat, lng });
        await user.save();

        res.status(201).json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const { label, address, isDefault, lat, lng } = req.body;

        const user = await User.findById(req.user.id);
        const addr = user.addresses.id(req.params.id);

        if (!addr) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach((a) => (a.isDefault = false));
        }

        if (label) addr.label = label;
        if (address) addr.address = address;
        if (isDefault !== undefined) addr.isDefault = isDefault;
        if (lat) addr.lat = lat;
        if (lng) addr.lng = lng;

        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const addr = user.addresses.id(req.params.id);

        if (!addr) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        addr.deleteOne();
        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProfile, updateProfile, addAddress, updateAddress, deleteAddress };
