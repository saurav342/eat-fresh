const express = require('express');
const router = express.Router();
const { getShops, getShop, getShopProducts } = require('../controllers/shopController');

router.get('/', getShops);
router.get('/:id', getShop);
router.get('/:id/products', getShopProducts);

module.exports = router;
