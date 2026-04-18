//登录与注册
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
//导入外部模块——->可以用函数
const loginHandle = require('../router_handle/login_handle')
const { reg_verify, login_verify } = require('../utils/checkinfor')
const appuse_verify = require('../middleware/appuse_verify')

//注册新用户
router.post('/register', appuse_verify(reg_verify), loginHandle.register)
//登录接口
router.post('/login', appuse_verify(login_verify), loginHandle.login)

//共享路由
module.exports = router