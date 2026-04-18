//项目的入口文件
const express = require('express')
const cors = require('cors')
const path = require('path')
// websocket初始化函数
const { initWebSocket } = require('./utils/websocket')
//导入路由
const loginRouter = require('./router/login')
const userInforRouter = require('./router/userInfor')
const classRouter = require('./router/class')
const scoreRouter = require('./router/score')
const logRouter = require('./router/log')
const noticeRouter = require('./router/notice')
//创建服务器
const app = express()



//中间部分

//跨域
app.use(cors())
//解析表单
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
//静态资源管理
app.use('/web', express.static(path.join(__dirname, '../web')))
//封装响应中间件
app.use(function (req, res, next) {
    res.cc = function (err, status = 1, data = null) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
            data: data,
        })
    }
    next()
})
//用户注册和登录路由
app.use('/api', loginRouter)
//获取用户信息路由
app.use('/api/user', userInforRouter)

//班级管理路由
app.use('/api/class', classRouter)

//成绩管理路由
app.use('/api/score', scoreRouter)

//日志管理路由
app.use('/api/log', logRouter)

//通知管理路由
app.use('/api/notice', noticeRouter)

//token验证失败错误中间件
app.use((err, req, res, next) => {
    if (err.name === 'JsonWebTokenError') {
        return res.cc('身份验证失败，请重新登录')
    }
    next(err)
})
//最后一个错误处理中间件
app.use((err, req, res, next) => {
    console.error(err)
    res.cc('服务器内部错误')
})
//获取服务器实例+启动服务器
const server = app.listen(8088, function () {
    console.log('api server running at http://127.0.0.1:8088')
})
// 初始化websocket
initWebSocket(server)