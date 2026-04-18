//token鉴权成功之后-->权限区分-->能否访问接口
module.exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.cc('权限不足：仅管理员可访问')
    }
    next()
}

module.exports.isTeacher = (req, res, next) => {
    if (req.user.role !== 'teacher') {
        return res.cc('权限不足：仅教师可访问')
    }
    next()
}
module.exports.isStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.cc('权限不足：仅学生可访问')
    }
    next()
}

module.exports.isAdminOrTeacher = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
        return res.cc('权限不足：仅管理员和教师可操作')
    }
    next()
}