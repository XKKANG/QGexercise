const db = require('../config/db').promise()
const pageDistribute = require('../utils/pageDistribute')
module.exports.logList = async (req, res) => {
    try {
        const { role, user_number } = req.user
        let { page } = req.query//当前页数，每一页条数//前端传
        if (!page) { page = 1 }

        //权限划分
        let conditions = []
        let params = []
        if (role === 'teacher') {
            const [teaClass] = await db.query('select id from classes where teacher_id=?', [user_number])
            if (teaClass.length === 0) {
                return res.cc('您未绑定班级')
            }
            conditions.push('class_id = ?')
            params.push(teaClass[0].id)
        }

        //传object
        const object = {
            tableName: 'logs',
            conditions: conditions,
            params: params,
            orderBy: 'order by create_time desc',
            page: page,
            limit: 10
        }
        const results = await pageDistribute(object)
        res.cc('日志查询成功', 0, results)
    } catch (err) { res.cc(err) }
}