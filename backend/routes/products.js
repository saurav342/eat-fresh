const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getProductsByCategory } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

module.exports = router;
