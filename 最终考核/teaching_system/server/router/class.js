const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { isAdmin, isAdminOrTeacher } = require('../middleware/permission')
const class_handle = require('../router_handle/class_handle')

//仅管理员可用接口

//操作班级-->添加,删除
router.post('/add', auth, isAdmin, class_handle.addClass)
router.post('/delete', auth, isAdmin, class_handle.deleteClass)
//班级成员
router.post('/members/add', auth, isAdmin, class_handle.addMember)
router.post('/members/update', auth, isAdmin, class_handle.updateMember)
router.post('/members/remove', auth, isAdmin, class_handle.removeMember)
//班级绑定老师
router.post('/bind-teacher', auth, isAdmin, class_handle.bindTeacher)
//解绑
router.post('/unbind-teacher', auth, isAdmin, class_handle.unbindTeacher)


//管理员和老师都可用-->后期验证-->细分老师对应班级

//班级
//查看
router.get('/list', auth, isAdminOrTeacher, class_handle.classList)
//管理班级成员-->查
router.get('/members', auth, isAdminOrTeacher, class_handle.memberList)


module.exports = router