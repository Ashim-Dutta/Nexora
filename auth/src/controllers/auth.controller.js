const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const cookie = require('cookie-parser')
const redis = require('../db/redis')



async function registerUser(req, res) { 
    
    try {

        const { username, email, password, fullName: { firstName, lastName } } = req.body
    
        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { username }, { email }
            ]
        })

        if (isUserAlreadyExist) {
            return res.status(409).json({ message: "User already exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
    
        const user = await userModel.create({
            username,
            email,
            password: hashPassword,
            fullName: { firstName, lastName }
        })

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET)
    
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 //1day
        })

        res.status(201).json({
            message: "user created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                address: user.address
            }
        })
    } catch(error) { 
        res.status(500).json({
            message:"Internal server error"
        })
    }

}

async function loginUser(req, res) { 

    try {

        const { username,email, password } = req.body
        const user = await userModel.findOne({ $or: [{ email }, {username}]}).select('+password')
        
        if (!user) { 
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid Credentials" });
        }


        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role:user.role
        }, process.env.JWT_SECRET)
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge:24*60*60*1000
        })

        return res.status(200).json({
          message: "user logged in successfully",
          user: {
            id: user._id,
            username: user.username,
              email: user.email,
              fullName: user.fullName,
              role: user.role,
            address:user.address
          },
        });
        
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }

}

async function getCurrentUser(req, res) { 
    return res.status(200).json({
        message: "Current user fetch successfully",
        user:req.user
    })
}


async function logoutUser(req, res) { 
    const token = req.cookie.token
    if (token) { 
        await redis.set(`blacklist:${token}`,'true','EX',24*60*60)
    }
    res.clearCookie('token', {
        httpOnly: true,
        secure:true
    })

    res.status(200).json({message:"Logged out successfully"})
}


async function getUserAddresses(req, res) { 

    const id = req.user.id
    const user = await userModel.findById(id).select('addresses');
    if (!user) { 
        return res.status(404).json({message:"User not found"})
    }

    return res.status(200).json({
        message: "User address fetch successfully",
        addresses:user.addresses
    })

}

async function addUserAddresses(req, res) { 
    const id = req.user.id
    const { street, city, state, pincode, country,  isDefault } = req.body
    
    const user = await userModel.findOneAndUpdate({ _id: id }, {
        $push: {
            addresses: {
                street,
                city,
                state,
                pincode,
                country,
                isDefault
            }
        }
    }, { new: true })
    
    if (!user) { 
        return res.status(404).json({message:"User not found"})
    }

    return res.status(201).json({
        message: "Address added successfully",
        address: user.addresses[user.addresses.length-1]
    })
}

async function deleteUserAddress(req, res) { 

    const id = req.user.id
    const { addressId } = req.params

    const isAddressExists = await userModel.findOne({ _id: id, 'address._id': addressId })
    if (!isAddressExists) {
        return res.status(404).json({message:"Address not found"})
    }
    
    const user = await userModel.findOneAndUpdate({ _id: id }, {
        $pull: {
            addresses: {_id:addressId}
        }
    }, { new: true })
    
    if (!user) { 
        return redis.status(404).json({
            message:"User not found"
        })
    }

    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId)
    if (addressExists) { 
        return res.status(500).json({
            message:"Failed to delete addresss"
        })
    }

    return res.status(200).json({
        message: "Address deleted successfully",
        addresses:"user.addresses"
    })
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser, 
    logoutUser, 
    getUserAddresses,
    addUserAddresses,
     deleteUserAddress
}