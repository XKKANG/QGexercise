const db = require('../config/db').promise()
const operationLog = require('../utils/add_log')
const pageDistribute = require('../utils/pageDistribute')
//仅admin
//班级
//新增
module.exports.addClass = async (req, res) => {
    try {
        const { classname } = req.body
        if (!classname) return res.cc('班级名称不能为空')
        //查重复
        const checksql = 'select * from classes where classname=?'
        const [results] = await db.query(checksql, [classname])
        if (results.length > 0) {
            return res.cc('班级已存在')
        }
        //插入
        const insertsql = 'insert into classes(classname) values (?)'
        const [id] = await db.query(insertsql, [classname])
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '班级新增', `新增班级：${classname} (id:${id.insertId})`, null]
        await operationLog(logs)

        res.cc('新增班级成功！', 0)

    } catch (err) {
        res.cc(err)
    }
}
//删除
module.exports.deleteClass = async (req, res) => {
    try {
        const { class_id } = req.body
        if (!class_id) return res.cc('班级id不能为空')

        // 获取班级信息（名称、老师ID）
        const [classCheck] = await db.query('select classname, teacher_id from classes where id=?', [class_id])
        if (classCheck.length === 0) return res.cc('班级不存在')
        const { classname, teacher_id } = classCheck[0]

        // 检查是否绑定老师
        if (teacher_id) {
            return res.cc('该班级已绑定班主任，请先解绑后再删除')
        }

        // 检查是否有学生
        const [students] = await db.query('select id from users where class_id = ?', [class_id])
        if (students.length > 0) {
            return res.cc('该班级存在学生，无法删除')
        }

        // 检查是否有成绩
        const [scores] = await db.query('select id from scores where class_id = ?', [class_id])
        if (scores.length > 0) {
            return res.cc('该班级存在成绩，无法删除')
        }

        // 检查是否有通知
        const [notices] = await db.query('select id from notices where class_id = ?', [class_id])
        if (notices.length > 0) {
            return res.cc('该班级存在通知，请先删除通知后再删除班级')
        }

        // 以上都没有-->执行删除
        await db.query('delete from classes where id = ?', [class_id])

        // 记录日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '班级删除', `删除班级：${classname} (id:${class_id})`, null]
        await operationLog(logs)
        res.cc('班级删除成功', 0)
    } catch (err) {
        res.cc(err)
    }
}
//绑定老师班级
module.exports.bindTeacher = async (req, res) => {
    try {
        const { class_id, user_number } = req.body
        if (!class_id || !user_number) return res.cc('参数不能为空')
        //绑定的班级是否有效
        const checksql = 'select * from classes where id=?'
        const [check] = await db.query(checksql, [class_id])
        if (check.length === 0) {
            return res.cc('该班级不存在，无法绑定')
        }
        //班级是否绑定了老师
        if (check[0].teacher_id) {
            return res.cc(`该班级已绑定老师 ${check[0].teacher_id}，请先解绑`)
        }
        //老师是否存在，是否是老师，是否已经绑定班级
        const sql = 'select * from users where user_number=?'
        const [results] = await db.query(sql, [user_number])
        if (results.length > 0) {
            if (results[0].role !== 'teacher') {
                return res.cc('无法绑定非教师账号')
            }
            //老师是否已经绑定
            const checksql = 'select * from classes where teacher_id = ?'
            const [exist] = await db.query(checksql, [user_number])
            if (exist.length > 0) return res.cc('该教师已绑定班级')
            //绑定
            const updatesq = 'update classes set teacher_id=? where id=?'
            await db.query(updatesq, [user_number, class_id])

            //添加日志
            const logs = [req.user.user_number, req.user.username, req.user.role, '教师与班级绑定', `绑定教师：${user_number} 与班级：${check[0].classname}(id:${class_id})`, null]
            await operationLog(logs)
            res.cc('教师绑定成功！', 0)
        } else { return res.cc('该教师不存在!') }
    } catch (err) {
        res.cc(err)
    }
}
//解绑老师（无关联数据，不会污染数据）
// 解绑老师
module.exports.unbindTeacher = async (req, res) => {
    try {
        const { class_id } = req.body
        if (!class_id) return res.cc('班级id不能为空')

        // 检查班级是否存在
        const [classCheck] = await db.query('select classname, teacher_id from classes where id = ?', [class_id])
        if (classCheck.length === 0) return res.cc('班级不存在')

        const { classname, teacher_id } = classCheck[0]
        if (!teacher_id) return res.cc('该班级未绑定任何老师，无需解绑')

        await db.query('update classes set teacher_id = null where id = ?', [class_id])

        const logs = [
            req.user.user_number,
            req.user.username,
            req.user.role,
            '解绑老师',
            `解绑班级 ${classname} (id:${class_id}) 的班主任 ${teacher_id}`,
            null
        ]
        await operationLog(logs)

        res.cc('解绑成功', 0)
    } catch (err) {
        res.cc(err)
    }
}

//班级成员管理
//添加
module.exports.addMember = async (req, res) => {
    try {
        const { user_number, class_id } = req.body
        if (!class_id || !user_number) return res.cc('参数不完整')
        //班级有效性
        const check1 = 'select * from classes where id=?'
        const [none] = await db.query(check1, [class_id])
        if (none.length === 0) return res.cc('该班级不存在，请确认班级id')

        //默认用户已经存在
        const [user] = await db.query('select * from users where user_number=?', [user_number])
        if (user.length > 0) {
            //但已有班级或不为学生
            if (user[0].class_id) return res.cc('该学生已加入其他班级，无法重复添加')
            if (user[0].role !== 'student') return res.cc('只能添加学生角色')
            //直接添加
            await db.query('update users set class_id=? where user_number=?', [class_id, user_number])
            //添加日志
            const logs = [req.user.user_number, req.user.username, req.user.role, '班级成员添加', `添加班级成员${user_number}`, null]
            await operationLog(logs)
            res.cc('添加学生成功', 0)
        }
        else { return res.cc('添加失败') }

    } catch (err) {
        res.cc(err)
    }
}
//移除
module.exports.removeMember = async (req, res) => {
    try {
        const { user_number } = req.body
        if (!user_number) return res.cc('学号不能为空')
        //是否为学生
        const confirmsql = 'select * from users where user_number=?'
        const [results] = await db.query(confirmsql, [user_number])
        if (results.length > 0) {
            if (results[0].role !== 'student') return res.cc('只能移除学生角色')
        }
        const findsql = 'update users set class_id=NULL where user_number=?'
        await db.query(findsql, [user_number])
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '班级成员移除', `移除班级成员${user_number}`, null]
        await operationLog(logs)
        res.cc('移除班级成员成功', 0)
    } catch (err) {
        return res.cc(err)
    }
}
//修改
module.exports.updateMember = async (req, res) => {
    try {
        const { user_number, username } = req.body
        if (!user_number) return res.cc('user_number 不能为空')
        const sql = 'update users set username = ? WHERE user_number = ?'
        const [results] = await db.query(sql, [username, user_number])
        if (results.affectedRows === 0) return res.cc('操作失败，请稍后重试。')
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '班级成员信息修改', `修改班级成员${user_number}的名字为：${username}`, null]
        await operationLog(logs)
        res.cc('修改班级成员信息成功', 0)
    } catch (err) { res.cc(err) }
}

//管理员和老师-->权限划分与拦截
//查看班级（添加搜索功能）
module.exports.classList = async (req, res) => {
    try {
        const { role, user_number } = req.user
        let { page, classname } = req.query
        if (!page) { page = 1 }
        let conditions = []
        let params = []
        //老师-->自己班级
        if (role === 'teacher') {
            conditions.push('teacher_id = ?')
            params.push(user_number)
        }
        //搜索关键词
        if (classname) {
            conditions.push('classname LIKE ?')
            params.push(`%${classname}%`)
        }
        const object = {
            tableName: 'classes',
            conditions: conditions,
            params: params,
            orderBy: 'order by classname',
            page: page,
        }
        const results = await pageDistribute(object)
        res.cc('查询班级信息成功', 0, results)
    } catch (err) {
        res.cc(err)
    }
}
//班级成员
//查看
module.exports.memberList = async (req, res) => {
    try {
        let { page, class_id } = req.query
        const { role, user_number } = req.user
        if (!class_id) return res.cc('班级id无效')
        if (!page) { page = 1 }

        //老师
        if (role === 'teacher') {
            const sql = 'select id from classes where id=? AND teacher_id=?'
            const [check] = await db.query(sql, [class_id, user_number])
            if (check.length === 0) {
                return res.cc('该用户权限为：教师。您只能查看自己班级的成员。')
            }

        }

        const object = {
            tableName: 'users',
            conditions: ['class_id = ?'],
            params: [class_id],
            orderBy: 'order by username asc',
            page: page,
        }

        const results = await pageDistribute(object)
        res.cc('获取班级成员成功', 0, results)
    } catch (err) { res.cc(err) }
}
