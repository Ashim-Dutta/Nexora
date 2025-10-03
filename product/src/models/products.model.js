const mongoose = require('mongoose')

 const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    price:{
        amount:{
            type:Number,
            require:true
        },
        currency:{
            type:String,
            enum:['USD','INR'],
            default:"INR"
        }
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    images:[
        {
            url:String,
            thumbnail:String,
            id:String
        }
    ]
 })

 module.exports = mongoose.model('product',productSchema)