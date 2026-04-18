//joi验证库，校验数据是否符合规则
const joi = require('joi')

// 定义单一规则
const username = joi.string()
    .min(3)
    .max(20)
    .pattern(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
    .required()

const password = joi.string()
    .min(6)
    .max(20)
    .pattern(/^[\S]+$/)
    .required()

const role = joi.string()
    .valid('student')
    .lowercase()
    .required()

const user_number = joi.string()
    .required()

// 封装规则导出
module.exports.reg_verify = joi.object({
    username,
    password,
    role,
})
module.exports.login_verify = joi.object({
    username,
    password,
    user_number,
})