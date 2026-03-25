const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next){
    const header = req.headers['authorization']
    if(!header){
        return res.status(401).json({error: "Token faltante"})
    }

    const token = header.split(" ")[1]
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        return res.status(403).json({error: "Token invalido"})
    }
}
module.exports = authMiddleware