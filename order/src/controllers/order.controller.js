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


async function getMyOrders(req,res) {
    
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit
    
    try {

        const orders = await orderModel.find({ user: user.id })
        const totalOrders = await orderModel.countDocuments({ user: user.id })
        
        res.status(200).json({
            orders,
            meta: {
                total: totalOrders,
                page,
                limit
            }
        })
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

async function getOrderById(req, res) {
    const user = req.user
    const orderId = req.params.id

    try {

        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({message:"Order not found"})
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({message:"Forbidden you do not have access"})
        }

        res.status(200).json({order})
        
    } catch (error) {
        res.status(500).json({message:"Internal server error",error})
    }
}

async function cancelOrderById(req, res) {
    
    const user = req.user
    const orderId = req.params.id
    
    try {
        
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({message:"Order not found"})
        }

        if (order.user.toString() !== user.id) {
            return res.status(403).json({message:"Forbidden you do not have access"})
        }

        // only PENDING orders can be cancelled

        if (order.status !== 'PENDING') {
            return res.status(409).json({message:"Order can not be cancel at this status"})
        }

        order.status = 'CANCELLED'
        order.timeline.push({ type: 'CANCELLED', at: new Date() })
        await order.save()

        res.status(200).json({order})

    } catch (error) {
        
    }

}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrderById
}