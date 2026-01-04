const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.route('/profile').get(getProfile).put(updateProfile);

router.route('/addresses').post(addAddress);
router.route('/addresses/:id').put(updateAddress).delete(deleteAddress);

module.exports = router;
