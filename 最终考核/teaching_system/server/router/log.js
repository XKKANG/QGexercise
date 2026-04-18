const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const logHandle = require('../router_handle/log_handle')
const { isAdminOrTeacher } = require('../middleware/permission')


router.get('/list', auth, isAdminOrTeacher, logHandle.logList)

module.exports = router