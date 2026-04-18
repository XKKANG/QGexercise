const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { isTeacher, isStudent } = require('../middleware/permission')
const noticeHandle = require('../router_handle/notice_handle')

//班主任接口
router.post('/publish', auth, isTeacher, noticeHandle.publishNotice)
router.post('/update', auth, isTeacher, noticeHandle.updateNotice)
router.post('/delete', auth, isTeacher, noticeHandle.deleteNotice)

router.get('/stats/number', auth, isTeacher, noticeHandle.statsNumber)
router.get('/stats/list', auth, isTeacher, noticeHandle.readAunreadList)

//三者都可以
router.get('/list', auth, noticeHandle.noticeList)
router.get('/detail', auth, noticeHandle.noticeDetail)
router.post('/read', auth, noticeHandle.readNotice)

module.exports = router