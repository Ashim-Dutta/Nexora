const express = require('express');
const router = express.Router();
const createMiddleware = require('../middlewares/auth.middleware');
const cartController = require('../controller/cart.controller');
const validation = require('../middlewares/validation.middleware');



router.get('/',
    createMiddleware(['user']),
    cartController.getCart
)

router.post('/items',
    validation.validateAddItemToCart,
    createMiddleware(['user']),
    cartController.addItemToCart);


router.patch('/items/:productId',
    validation.validateUpdateCartItem,
    createMiddleware(['user']),
    cartController.updateItemQuantity);


module.exports = router;