//登录注册验证表单信息中间件

function appuse_verify(schema) {
    function realMiddleware(req, res, next) {
        const { error } = schema.validate(req.body)
        if (error) {
            return res.cc(error.details[0].message)
        }
        next()
    }
    return realMiddleware
}

module.exports = appuse_verify