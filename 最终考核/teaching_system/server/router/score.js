const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const scoreHandle = require('../router_handle/score_handle')
const { isAdminOrTeacher } = require('../middleware/permission')
//成绩
//成绩查询-->三种排序：学号，科目，班级
router.get('/list', auth, scoreHandle.scoreList)
//添加
router.post('/add/single', auth, isAdminOrTeacher, scoreHandle.addSingleScore)
router.post('/add/batch', auth, isAdminOrTeacher, scoreHandle.addBatchScore)
// //删除
router.post('/delete', auth, isAdminOrTeacher, scoreHandle.deleteScore)
// //修改
router.post('/update', auth, isAdminOrTeacher, scoreHandle.updateScore)
//统计-->分班级，科目
router.get('/stats/class', auth, scoreHandle.statsClass)
router.get('/stats/subject', auth, scoreHandle.statsSubject)

// //导出
router.get('/subjects', auth, isAdminOrTeacher, scoreHandle.getSubjectsForExport)
router.get('/export', auth, isAdminOrTeacher, scoreHandle.exportScore)

module.exports = router