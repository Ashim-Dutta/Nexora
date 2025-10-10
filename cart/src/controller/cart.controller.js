const cartModel = require('../models/cart.model');

async function addItemToCart(req, res) { 

    const { productId, quantity } = req.body;

    const user = req.user; // Assuming user info is available in req.user

    let cart = await cartModel.findOne({ userId: user._id });

    if (!cart) {
        cart = new cartModel({ user: user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart });
}

async function updateItemQuantity(req, res) { 
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = req.user; // Assuming user info is available in req.user
    let cart = await cartModel.findOne({ userId: user._id });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex < 0) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[existingItemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Item quantity updated', cart });
}


async function getCart(req, res) { 
    const user = req.user; // Assuming user info is available in req.user
    let cart = await cartModel.findOne({ userId: user._id }).populate('items.productId');
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({
        cart,
        totals: {
            itemCount: cart.items.length,
            totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        }
     });
}



module.exports = {
    addItemToCart,
    updateItemQuantity,
    getCart
}