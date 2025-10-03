const Product = require('../models/products.model')
const { uploadImage } = require('../services/imagekit.service')



async function createProduct(req, res) {
    try {

        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body
        
        if (!title || !priceAmount) {
            return res.status(400).json({
                message:"title,priceAmount and seller are required"
            })
        }

        const seller = req.user.id

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        };

        const images = []
        const files = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })))
        
        const product = await Product.create({ title, description, price, seller, images })
        return res.status(201).json({
            message: "Product Created",
            data:product
        })
        
    } catch (error) {
        error('create product error', error)
        return res.status(500).json({
            messahe:"Internal server error"
        })
    }
}


module.exports = createProduct