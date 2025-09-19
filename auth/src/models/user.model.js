const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select:false},
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    
    role: { type: String, enum: ['user', 'seller'], default: 'user' },
    address: [
       addressSchema
    ]
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;