const jwt = require('jsonwebtoken')
const config = require('../config/config_jwt')

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.cc('请先登录')
    }
    //token是否过期
    try {
        const checkdate = jwt.verify(token, config.jwtSecretKey)
        req.user = checkdate
        next()
    } catch (err) {
        next(err)
    }
}