const productsModel = require('../models/products.model')
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

        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })))
        
        const product = await ProductModel.create({ title, description, price, seller, images })
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

async function getProducts(req, res) {
    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query
    
    const filter = {}
        if(q) {
            filter.$text ={$search:q}
        }

        if(minprice) {
            filter['price.amount'] = {...filter['price.amount'],$gte:Number(minprice)}
        }

        if(maxprice) {
            filter['price.amount'] = {...filter['price.amount'],$gte:Number(minprice)}
        }

        const products = await productsModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit),20))
        
    return res.status(200).json({
        data:products
    })
}

async function getProductById(req,res) {
    const { id } = req.params;

    const product = await productsModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message:"Product not found"
        })
    }

    return res.status(200).json({product:product})
}


async function updateProduct(req, res) {
    
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message:"Invalid product id"})
    }

    const product = await productModel.findOne({
        _id: id,
    })

    if (!product) {
        return res.status(404).json({message:"Product not found"})
    }

    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({message:"forbidden you can only update your own product"})
    }

    const allowUpdates = ['title', 'description', 'price']
    for (const key of Object.keys(req.body)) {
        if (allowUpdates.includes(key)) {
            if (key === 'price' && typeof req.body.price === 'object') {
                if (req.body.price.amount !== undefined) {
                    product.price.amount = Number(req.body.price.amount)
                }
                if (req.body.price.currency !== undefined) {
                    product.price.currency = req.body.price.currency
                } else {
                    product[key] = req.body[key]
                }
            }
        }
    }

    await product.save()
    return res.status(200).json({message:"Product Updated",product})
}

async function deleteProduct(req, res) { 
    const { id } = req.params
    
       if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message:"Invalid product id"})
    }

       const product = await productModel.findOne({
        _id: id,
       })
    
        if (!product) {
        return res.status(404).json({message:"Product not found"})
    }
        if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({message:"forbidden you can only update your own product"})
    }

    await productsModel.findOneAndDelete({_id: id})
    return res.status(200).json({message:"Product is successfully deleted"})
}


async function getProductsBySeller(req, res) {
    const seller = req.user
    const { skip = 0, limit = 20 } = req.query
    const products = await productsModel.find({ seller: seller.id }).skip(skip).limit(Math.min(limit, 20))
    
    return res.status(200).json({data:products})
}


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller
}