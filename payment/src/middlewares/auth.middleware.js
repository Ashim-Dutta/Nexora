const jwt = require("jsonwebtoken")




function createAuthMiddleware(roles = ['user']) {
    const token = req.cookie?.token || req.header?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message:"Unauthorized:No token provided"
        })
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({
                message:"Forbidden:Insufficient "
            })
        }

    } catch (error) {
        
    }
}