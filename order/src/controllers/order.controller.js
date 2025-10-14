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
    
   } catch (error) {
       return res.status(500).json({
        message:"Internal Server error",error
    })
   }
    


}

module.exports = {
    createOrder
}