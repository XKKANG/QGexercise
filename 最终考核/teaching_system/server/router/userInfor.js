const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { isAdmin, isTeacher, isStudent } = require('../middleware/permission')
const userInforHadle = require('../router_handle/userinfor_handle')

//客户端带token发送请求-->鉴权获取信息，判断权限，响应信息给前端
//获取当前用户信息
router.get('/infor', auth, userInforHadle.getInfor)

//管理员可获得
router.get('/allinfor', auth, isAdmin, userInforHadle.getAllInfor)

// //测试
// // 仅教师可访问
// router.get('/teacher', auth, isTeacher, (req, res) => {
//     res.cc('教师接口：访问成功', 0)
// })

// // 仅学生可访问
// router.get('/student', auth, isStudent, (req, res) => {
//     res.cc('学生接口：访问成功', 0)
// })
module.exports = router