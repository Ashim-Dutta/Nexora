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


module.exports = {
    registerUser,loginUser,getCurrentUser,logoutUser
}