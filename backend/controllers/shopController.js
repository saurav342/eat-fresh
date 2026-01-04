const Shop = require('../models/Shop');
const Product = require('../models/Product');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
    try {
        const { isOpen, freeDelivery, category, search } = req.query;

        const query = {};

        if (isOpen === 'true') query.isOpen = true;
        if (freeDelivery === 'true') query.freeDelivery = true;
        if (category) query.categories = { $in: [category] };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { categories: { $elemMatch: { $regex: search, $options: 'i' } } },
            ];
        }

        const shops = await Shop.find(query).sort({ rating: -1 });

        res.json({ success: true, count: shops.length, shops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
const getShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return res.status(404).json({ success: false, message: 'Shop not found' });
        }

        res.json({ success: true, shop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get products by shop
// @route   GET /api/shops/:id/products
// @access  Public
const getShopProducts = async (req, res) => {
    try {
        const { category, available } = req.query;

        const query = { shopId: req.params.id };

        if (category) query.category = category;
        if (available === 'true') query.isAvailable = true;

        const products = await Product.find(query).sort({ category: 1, name: 1 });

        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getShops, getShop, getShopProducts };
