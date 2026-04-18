const db = require('../config/db').promise()
const XLSX = require('xlsx')
const operationLog = require('../utils/add_log')
const pageDistribute = require('../utils/pageDistribute')
const { broadcastToClass } = require('../utils/websocket')
//单条添加成绩
module.exports.addSingleScore = async (req, res) => {
    try {
        const { role, user_number } = req.user
        const { student_id, subject, score } = req.body

        //检验数据
        if (!student_id || !subject || score == null) {
            return res.cc('参数不完整')
        }
        //自动匹配学生信息
        const [stu] = await db.query('select class_id,username from users where user_number=?', [student_id])
        if (stu.length === 0) {
            return res.cc(`成绩数据有误，该学生不存在`)
        }
        const { class_id, username } = stu[0]
        //权限

        if (role === 'teacher') {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            if (class_id !== check[0].id) {
                return res.cc('您只能添加自己班级学生的成绩')
            }
        }
        //添加成绩
        let sql = 'insert into scores(student_id,subject,score,class_id,username) values(?,?,?,?,?)'
        const [results] = await db.query(sql, [student_id, subject, score, class_id, username])
        broadcastToClass(class_id, {
            type: 'score_update'
        })
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '单条添加成绩', `添加学生${student_id}的${subject}成绩为${score}`, class_id]
        await operationLog(logs)
        return res.cc('单条成绩添加成功', 0, { affectedRows: results.affectedRows })
    } catch (err) { res.cc(err) }
}
//批量添加-->有不合格的成绩数据，全部不添加
module.exports.addBatchScore = async (req, res) => {
    try {
        const { role, user_number } = req.user
        const { list } = req.body
        //这个list总体格式对不对
        if (!list || !Array.isArray(list) || list.length === 0) {
            return res.cc('请传入成绩数组')
        }
        //这个老师能否添加
        let teaClassID = 0
        if (role === 'teacher') {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            teaClassID = check[0].id
        }
        //检验list每项-->数据完整？学生存在？老师对应班级？
        let temp = []
        for (let item of list) {
            const { student_id, subject, score } = item
            //空数据
            if (!student_id || !subject || score == null) {
                return res.cc(`数据:${JSON.stringify(item)}不完整，取消批量添加操作`)
            }
            //自动匹配学生名字和班别
            const [stu] = await db.query('select class_id,username from users where user_number=?', [student_id])
            if (stu.length === 0) {
                return res.cc(`成绩数据有误，学生${student_id}不存在，取消批量添加操作`)
            }
            const { class_id, username } = stu[0]
            //老师能否添加这一条
            if (role === 'teacher' && class_id !== teaClassID) {
                return res.cc(`学生${student_id}不属于您的班级，取消批量添加操作`)
            }
            //这条通过，存起来
            temp.push([student_id, subject, score, class_id, username])

        }
        //每一条都通过
        //插入数据库
        await db.query('start transaction')
        const insertsql = 'insert into scores (student_id, subject, score, class_id, username) values ?'
        const [results] = await db.query(insertsql, [temp])
        await db.query('commit')
        if (role === 'teacher' && teaClassID) {
            broadcastToClass(teaClassID, {
                type: 'score_update'
            });
        }
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '批量添加成绩', `共添加${results.affectedRows}条成绩`, teaClassID]
        await operationLog(logs)

        res.cc('成绩批量添加成功', 0, { count: results.affectedRows })
    } catch (err) {
        await db.query('rollback')
        res.cc('成绩批量添加失败: ' + err.message)
    }
}
//查询成绩
module.exports.scoreList = async (req, res) => {
    try {
        const { role, user_number } = req.user
        let { page, order_by } = req.query//划分方式
        if (!page) { page = 1 }
        //权限划分(通过sql语句)
        let conditions = []
        let params = []
        if (role === 'student') {
            conditions.push('student_id=?')
            params.push(user_number)
        }
        let teaClassID = 0
        if (role === "teacher") {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            teaClassID = check[0].id
            conditions.push('class_id=?')
            params.push(teaClassID)
        }

        //三种排序方式 班级 学号 科目
        let orderBy = ''
        if (order_by === 'class_id') {
            orderBy = 'order by class_id'
        } else if (order_by === 'student_id') {
            orderBy = 'order by student_id'
        } else if (order_by === 'subject') {
            orderBy = 'order by subject'
        }
        const object = {
            tableName: 'scores',
            conditions: conditions,
            params: params,
            orderBy: orderBy,
            page: page,
            limit: 10
        }
        const results = await pageDistribute(object)
        return res.cc(`成绩查询成功${orderBy}`, 0, results)
    } catch (err) { res.cc(err) }
}

//公共函数：根据用户权限获得班级科目-->distinct subject
async function getSubjectsByUser(role, user_number, class_id = null, targetClassID = null) {
    // 确定要查询的班级ID
    let targetClassId = targetClassID
    if (role === 'student') {
        targetClassId = class_id
    } else if (role === 'teacher') {
        if (!targetClassId) {
            const [check] = await db.query('select id from classes where teacher_id = ?', [user_number])
            if (check.length === 0) return []
            targetClassId = check[0].id
        }
    }
    if (!targetClassId) return []

    const [rows] = await db.query(
        'select distinct subject from scores where class_id = ?',
        [targetClassId]
    )
    return rows.map(row => row.subject)
}

//统计
function statsCalc(scoreArr) {
    const count = scoreArr.length
    if (count === 0) {
        return {
            avg: '0.00',
            max: '0.00',
            min: '0.00',
            passCount: 0,
            passRate: '0.00%',
            totalStudents: 0
        }
    }
    const sum = scoreArr.reduce((a, b) => a + b, 0)
    const avg = (sum / count).toFixed(2)
    const max = (Math.max(...scoreArr)).toFixed(2)
    const min = (Math.min(...scoreArr)).toFixed(2)
    const passCount = scoreArr.filter(item => item >= 60).length
    const passRate = ((passCount / count) * 100).toFixed(2) + '%'
    return {
        avg: avg,
        max: max,
        min: min,
        passCount: passCount,
        passRate: passRate,
        totalStudents: count
    }
}
//班级划分的统计
//拿到每个人的总分，不用知道具体是谁
module.exports.statsClass = async (req, res) => {
    try {
        const { role, user_number, class_id } = req.user

        let targetClassID = req.query.class_id//想看到的班级（只有admin需要提交）

        if (role === 'student') {
            targetClassID = class_id
        }
        else if (role === 'teacher') {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            targetClassID = check[0].id
        }
        if (!targetClassID) { return res.cc('请提供班级id') }
        // 班级是否存在
        const [classcheck] = await db.query('select id from classes where id=?', [targetClassID])
        if (classcheck.length === 0) {
            return res.cc('该班级不存在，无法统计')
        }
        const [results] = await db.query('select sum(score) as total from scores where class_id=? group by student_id', [targetClassID])
        const scoreArr = results.map(item => +item.total)
        const statsClassList = statsCalc(scoreArr)
        res.cc('按班级统计成功', 0, statsClassList)

    } catch (err) { res.cc(err) }
}


//按科目统计
module.exports.statsSubject = async (req, res) => {
    try {
        const { role, user_number, class_id } = req.user
        let targetClassID = req.query.class_id

        if (role === 'student') {
            targetClassID = class_id
        } else if (role === 'teacher') {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            targetClassID = check[0].id
        }
        if (!targetClassID) {
            return res.cc('请提供班级id')
        }

        // 获取科目列表
        const subjects = await getSubjectsByUser(role, user_number, class_id, targetClassID)
        if (subjects.length === 0) {
            return res.cc('该班级暂无成绩数据', 0, { subjects: [] })
        }

        const result = []
        for (let subject of subjects) {
            const [rows] = await db.query(
                'SELECT score FROM scores WHERE class_id = ? AND subject = ?',
                [targetClassID, subject]
            )
            const scoreArr = rows.map(r => r.score)
            const stats = statsCalc(scoreArr)
            result.push({
                subject: subject,
                avg: stats.avg,
                max: stats.max,
                min: stats.min,
                passCount: stats.passCount,
                passRate: stats.passRate,
                totalStudents: stats.totalStudents
            })
        }
        res.cc('获取成功', 0, { subjects: result })
    } catch (err) {
        res.cc(err)
    }
}
//修改成绩
module.exports.updateScore = async (req, res) => {
    try {
        const { student_id, subject, score } = req.body
        const { role, user_number } = req.user
        if (!student_id || subject == null || score == null) return res.cc('参数不完整')
        const sql = 'select class_id from scores where student_id=? AND subject=?'
        //查成绩是哪个班-->老师能否改
        const [scoreclass] = await db.query(sql, [student_id, subject])
        if (scoreclass.length === 0) {
            return res.cc('该学生成绩不存在')
        }
        let teaClassID = 0
        if (role === 'teacher') {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            teaClassID = check[0].id
            if (scoreclass[0].class_id !== teaClassID) {
                return res.cc('您只能修改本班学生的成绩')
            }
        }
        await db.query('update scores set score=? where student_id=? AND subject=?', [score, student_id, subject])
        // 广播成绩变更
        broadcastToClass(scoreclass[0].class_id, {
            type: 'score_update'
        })
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '成绩修改', `修改学生 ${student_id} 的 ${subject} 成绩为 ${score}`, teaClassID]
        await operationLog(logs)

        return res.cc('学生成绩修改成功', 0)
    } catch (err) { res.cc(err) }
}
//删除成绩
module.exports.deleteScore = async (req, res) => {
    try {
        const { student_id, subject } = req.body
        const { role, user_number } = req.user
        if (!student_id || subject == null) {
            return res.cc('参数不完整')
        }
        //成绩是否存在+获取班级
        const sql = 'select class_id from scores where student_id=? AND subject=?'
        const [scoreclass] = await db.query(sql, [student_id, subject])
        if (scoreclass.length === 0) {
            return res.cc('该学生成绩不存在')
        }
        let teaClassID = null
        if (role === 'teacher') {
            const [check] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (check.length === 0) {
                return res.cc('您未绑定班级')
            }
            teaClassID = check[0].id
            if (scoreclass[0].class_id !== teaClassID) {
                return res.cc('您只能删除本班学生的成绩')
            }
        }
        //删除
        await db.query('delete from scores where student_id=? AND subject=?', [student_id, subject])
        broadcastToClass(scoreclass[0].class_id, {
            type: 'score_update'
        })
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '成绩删除', `删除学生 ${student_id} 的 ${subject} 成绩`, teaClassID]
        await operationLog(logs)

        return res.cc('成绩删除成功', 0)
    } catch (err) { res.cc(err) }
}



//导出成绩选择
module.exports.getSubjectsForExport = async (req, res) => {
    try {
        const { role, user_number, class_id: userClassId } = req.user
        const { class_id } = req.query

        // 学生无权限获取科目列表
        if (role === 'student') {
            return res.cc('无权限')
        }

        let targetClassID = class_id
        if (role === 'teacher') {
            const [teacherClass] = await db.query('SELECT id FROM classes WHERE teacher_id = ?', [user_number])
            if (teacherClass.length === 0) return res.cc('您未绑定班级')
            if (targetClassID && targetClassID != teacherClass[0].id) {
                return res.cc('只能查看自己班级的科目')
            }
            targetClassID = teacherClass[0].id
        } else if (role === 'admin') {
            if (!targetClassID) return res.cc('请提供班级id')
            const [cls] = await db.query('SELECT id FROM classes WHERE id = ?', [targetClassID])
            if (cls.length === 0) return res.cc('班级不存在')
        }

        const subjects = await getSubjectsByUser(role, user_number, userClassId, targetClassID)
        res.cc('获取成功', 0, subjects)
    } catch (err) {
        res.cc(err)
    }
}

//导出成绩-->按班级或者科目
module.exports.exportScore = async (req, res) => {
    try {
        const { role, user_number, class_id: userClassId } = req.user
        let { class_id, subject } = req.query

        if (role === 'student') {
            return res.cc('无权限导出成绩')
        }

        let finalClassId = null
        let className = ''

        if (role === 'teacher') {
            // 教师只能导出自己管理的班级
            const [teacherClass] = await db.query('SELECT id, classname FROM classes WHERE teacher_id = ?', [user_number])
            if (teacherClass.length === 0) return res.cc('您未绑定班级，无法导出')
            finalClassId = teacherClass[0].id
            className = teacherClass[0].classname
            // 如果教师主动传了class_id，必须与自己班级一致
            if (class_id && class_id != finalClassId) {
                return res.cc('您只能导出自己班级的成绩')
            }
        } else if (role === 'admin') {
            if (!class_id) return res.cc('请提供班级ID')
            const [cls] = await db.query('SELECT classname FROM classes WHERE id = ?', [class_id])
            if (cls.length === 0) return res.cc('班级不存在')
            finalClassId = class_id
            className = cls[0].classname
        }

        let sql = `SELECT student_id as 学号, username as 姓名, class_id as 班级, subject as 科目, score as 分数 
                   FROM scores WHERE class_id = ?`
        let params = [finalClassId]
        if (subject) {
            sql += ` AND subject = ?`
            params.push(subject)
        }

        const [list] = await db.query(sql, params)
        if (list.length === 0) return res.cc('没有符合条件的成绩可导出')

        let filename = `${className}成绩表`
        if (subject) filename += `(${subject})`
        filename += '.xlsx'

        const ws = XLSX.utils.json_to_sheet(list)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "成绩表")

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
        return res.send(buffer)

    } catch (err) {
        console.error(err)
        res.cc('导出失败：' + err.message)
    }
}




