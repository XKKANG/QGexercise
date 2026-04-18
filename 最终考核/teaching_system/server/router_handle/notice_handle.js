const db = require('../config/db').promise()
const findTeacherClassId = require('../utils/findTeacherClassId')
const operationLog = require('../utils/add_log')
const pageDistribute = require('../utils/pageDistribute')
const { broadcastToClass } = require('../utils/websocket')
//仅班主任

//判断函数
async function checkNotice(teacher_id, notice_id, str) {
    //权限判断-->能否编辑
    //是否绑定
    const class_id = await findTeacherClassId(teacher_id)
    if (!class_id) { return { err: `您未绑定班级，无法${str}通知` } }
    //通知是否存在
    const [oldnotice] = await db.query('select * from notices where id=?', [notice_id])
    if (oldnotice.length === 0) { return { err: '该通知不存在' } }
    //是否是自己发布的
    if (oldnotice[0].teacher_id !== teacher_id) {
        return { err: `您只能${str}自己发布的通知` }
    }
    //通过
    return { err: null, data: oldnotice[0] }
}
//发布通知
module.exports.publishNotice = async (req, res) => {
    try {
        const { title, content } = req.body
        const { user_number } = req.user
        const class_id = await findTeacherClassId(user_number)
        if (!class_id) { return res.cc('您未绑定班级，无法发布通知') }
        const [findClassName] = await db.query('select classname from classes where id=?', [class_id])
        //添加
        const [results] = await db.query('insert into notices(title,content,class_id,teacher_id) values(?,?,?,?)', [title, content, class_id, user_number])
        // 告诉客户端有新通知
        broadcastToClass(class_id, {
            type: 'notice_new'
        })
        //添加日志
        const logs = [req.user.user_number, req.user.username, req.user.role, '发布通知', `${findClassName[0].classname}发布了新通知`, class_id]
        await operationLog(logs)
        return res.cc('发布通知成功', 0)
    } catch (err) { res.cc(err) }
}
//编辑通知
module.exports.updateNotice = async (req, res) => {
    try {

        let { id, title, content } = req.body
        const { user_number } = req.user
        if (!id) {
            return res.cc("通知id不能为空")
        }
        //检测
        const check = await checkNotice(user_number, id, '编辑')
        if (check.err) return res.cc(check.err)
        const class_id = check.data.class_id

        //更新编辑
        title = !title ? check.data.title : title
        content = !content ? check.data.content : content
        //
        await db.query('update notices set title=?, content=?, update_time=now() where id=?', [title, content, id])
        // 广播更新数据
        broadcastToClass(class_id, {
            type: 'notice_update',
        })
        //添加日志
        const [findClassName] = await db.query('select classname from classes where id=?', [class_id])
        const logs = [req.user.user_number, req.user.username, req.user.role, '编辑通知', `${findClassName[0].classname}编辑了通知${id}`, class_id]
        await operationLog(logs)

        return res.cc('编辑通知成功', 0)
    } catch (err) { res.cc(err) }
}
//删除
module.exports.deleteNotice = async (req, res) => {
    try {

        const { id } = req.body
        const { user_number } = req.user
        if (!id) {
            return res.cc("通知id不能为空")
        }
        //检测
        const check = await checkNotice(user_number, id, '删除')
        if (check.err) return res.cc(check.err)
        const class_id = check.data.class_id

        //先删关联-->已读记录
        await db.query('delete from notice_read where notice_id=?', [id])
        await db.query('delete from notices where id=?', [id])
        // 广播通知删除
        broadcastToClass(class_id, {
            type: 'notice_delete'

        })
        //添加日志
        const [findClassName] = await db.query('select classname from classes where id=?', [class_id])
        const logs = [req.user.user_number, req.user.username, req.user.role, '删除通知', `${findClassName[0].classname}删除了通知${id}`, class_id]
        await operationLog(logs)

        return res.cc('删除通知成功', 0)
    } catch (err) { res.cc(err) }
}

//统计
//统计数字
module.exports.statsNumber = async (req, res) => {
    try {
        const { notice_id } = req.query
        const { user_number } = req.user
        const check = await checkNotice(user_number, notice_id, '统计人数')
        if (check.err) return res.cc(check.err)
        const class_id = check.data.class_id

        //总人数
        const [cal1] = await db.query('select count(*) as total from users where class_id=?', [class_id])
        const total = cal1[0].total
        //已读人数
        const [cal2] = await db.query('select count(*) as readCount from notice_read where notice_id=?', [notice_id])
        const readCount = cal2[0].readCount
        const unreadCount = total - readCount

        return res.cc('统计成功', 0, {
            total: total,
            readCount: readCount,
            unreadCount: unreadCount
        })
    } catch (err) { res.cc(err) }
}
//已读与未读名单
module.exports.readAunreadList = async (req, res) => {
    try {
        const { notice_id } = req.query
        const { user_number } = req.user
        const check = await checkNotice(user_number, notice_id, '查看名单')
        if (check.err) return res.cc(check.err)
        const class_id = check.data.class_id

        //已读名单
        const readsql = 'select student_id,student_name from notice_read where notice_id=? order by student_id'
        const [readList] = await db.query(readsql, [notice_id])
        //未读
        const unreadsql = 'select user_number,username from users where class_id=? AND role="student" AND user_number not in(select student_id from notice_read where notice_id=?) order by user_number'
        const [unreadList] = await db.query(unreadsql, [class_id, notice_id])

        return res.cc('获取名单成功', 0, {
            readList,
            unreadList
        })
    } catch (err) { res.cc(err) }
}

//三者都可以看
//查看班级通知

//通知列表(通知页面呈现)
module.exports.noticeList = async (req, res) => {
    try {
        let { page } = req.query
        const { role, user_number } = req.user
        if (!page) { page = 1 }
        let conditions = []
        let params = []
        if (role === 'student') {
            conditions.push('class_id=?')
            params.push(req.user.class_id)
        }

        if (role === 'teacher') {
            const class_id = await findTeacherClassId(user_number)
            if (!class_id) {
                return res.cc('您未绑定班级，无法获得通知列表')
            }
            conditions.push('class_id=?')
            params.push(class_id)
        }
        //分页

        const object = {
            tableName: 'notices',
            conditions: conditions,
            params: params,
            orderBy: 'order by create_time DESC',
            page: page,
            limit: 3
        }
        const results = await pageDistribute(object)
        //标记已读或者未读-->前端根据这个进行排序
        if (role === 'student') {
            const [readList] = await db.query('select notice_id from notice_read where student_id=?', [user_number])
            //已读的通知id变成数组
            const readIdArr = readList.map(item => item.notice_id)
            if (!results.list) {
                results.list = []
            }
            results.list.forEach(item => {
                //判断这个通知的id是否在已读数组里面
                //添加是否已读对象-->方便前端渲染
                if (readIdArr.includes(item.id)) {
                    item.is_read = true
                } else { item.is_read = false }
            })
        }
        res.cc('获取通知列表成功', 0, results)
    } catch (err) { res.cc(err) }
}
//通知详情(点击具体某一条消息呈现内容)
module.exports.noticeDetail = async (req, res) => {
    try {
        const { id } = req.query
        const { role, user_number, username } = req.user
        if (!id) {
            return res.cc("通知id不能为空")
        }
        //通知是否存在
        const [notice] = await db.query('select * from notices where id=?', [id])
        if (notice.length === 0) {
            return res.cc('该通知不存在')
        }
        //权限
        if (role === 'student') {
            if (notice[0].class_id !== req.user.class_id) { return res.cc('你无权限查看该通知') }
            //查看成功，添加已读
            await db.query('insert ignore into notice_read(notice_id,student_id,student_name) values (?,?,?)', [id, user_number, username])
        }
        if (role === 'teacher') {
            const class_id = await findTeacherClassId(user_number)
            if (!class_id) {
                return res.cc('您未绑定班级，无法查看通知详情')
            }
            if (notice[0].class_id !== class_id) {
                return res.cc('您无权限查看该通知')
            }
        }
        return res.cc('获取通知详情成功', 0, notice[0])
    } catch (err) { res.cc(err) }
}

//标记通知为已读
module.exports.readNotice = async (req, res) => {
    try {
        const { role, user_number } = req.user
        const { id } = req.body

        if (!id) {
            return res.cc('通知ID不能为空')
        }

        // 只有学生可以标记已读
        if (role !== 'student') {
            return res.cc('只有学生可以标记通知已读')
        }

        // 判断通知是否存在
        const [notice] = await db.query('select id from notices where id = ?', [id])
        if (notice.length === 0) {
            return res.cc('通知不存在')
        }

        // 判断是否已经读过-->避免重复插入
        const [exists] = await db.query(
            'select id from notice_read where notice_id = ? AND student_id = ?',
            [id, user_number]
        )
        if (exists.length > 0) {
            return res.cc('已读', 0)
        }

        // 插入已读记录
        await db.query(
            'insert into notice_read (notice_id, student_id,student_name) values (?,?,?)',
            [id, user_number, req.user.username]
        )

        // 日志
        await operationLog([
            user_number,
            req.user.username,
            role,
            '通知已读',
            `学生已读通知 ID: ${id}`,
            req.user.class_id
        ])

        return res.cc('标记已读成功', 0)
    } catch (err) {
        res.cc('标记已读失败：' + err.message)
    }
}
