const orderModel  = require('../models/order.model')
const axios = require('axios')
async function createOrder(req,res) {
    

    const user = req.user
    const token = req.cookies?.token || req.header?.authorization?.split(' ')[1];

    try {
       
        //fetch user cart from cart service

        const cartResponse = await axios.get(`http://localhost:3002/api/cart`, {
            headers: {
                Authorization:`Bearer ${token}`
            }
        })

        const products = await promise.all(cartResponse.data.cart.items.map(async(item) => {
            return (await axios.get(`http://localhost:3001/api/products/${item.productId}`, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })).data.data
        }))


        let priceAmount = 0;
        const orderItems = cartResponse.data.cart.items.map((item, index) => {
            const product = products.find(p => p._id === item.productId)

            // if not in stock, does not allow order creation

            if (product.stock < item.quantity) {
                throw new Error(`Product ${product.title} is out of stock or insufficient stock`)
            }

            const itemTotal = product.price.amount * item.quantity
            priceAmount += itemTotal

            return {
                product: item.productId,
                quantity: item.quantity,
                price: {
                    amount: itemTotal,
                    currency:product.price.currency
                }
            }
        })

        const order = await orderModel.create({
            user: user.id,
            items: orderItems,
            status: "PENDING",
            totalPrice: {
                amount: priceAmount,
                currency:"INR"
            },
            shippingAddress:req.body.shippingAddress
        })

    
   } catch (error) {
       return res.status(500).json({
        message:"Internal Server error",error
    })
   }
    


}

module.exports = {
    createOrder
}