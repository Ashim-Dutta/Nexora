const jwt = require('jsonwebtoken')

function createAuthMiddleware(roles=["user"]){
    return function authMiddleware(req,res,next){
        const token = req.cookies?.token || req.header?.authorization.split(' ')[1]

        if(!token){
            return res.status(401).json({
                message:"Unauthorized No token found"
            })
        }
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            if(!roles.oncludes(decoded.role)){
                return res.status(403).json({
                    message:"Forbidden Insufficient permission"
                })
            }
            req.user = decoded;
            next()
            
        } catch (error) {
            return res.status(401).json({
                message:"Unauthorized: Inavalid token"
            })
        }
    }
}

module.exports = createAuthMiddleware