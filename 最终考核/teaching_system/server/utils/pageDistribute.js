//分页查看统一函数
const db = require('../config/db').promise()
//object是一个对象
//例如
// const payload = {
// tableName: 'scores',
//     conditions: ['class_id = ?', 'subject = ?'],
//         params: [2, '数学'],
//             orderBy: 'ORDER BY score DESC',
//                 page: 1,
//                    
// }
module.exports = async (object) => {
    try {
        let { tableName,
            conditions = [],
            params = [],
            orderBy,
            page,
            limit
        } = object
        if (!limit) { limit = 6 }
        //数据库跳过前面多少条
        const offset = (page - 1) * limit

        //分页操作-->当前页（数据呈现） 和总页数（下面页数跳转）
        //总页数需要数据
        let countsql = `select count(*) as countTotal from ${tableName}`
        if (conditions.length > 0) {
            countsql += ' where ' + conditions.join(' AND ')
        }
        //总条数
        const [countResults] = await db.query(countsql, params)
        const countTotal = countResults[0].countTotal
        //总页数
        const totalPage = Math.ceil(countTotal / limit)

        //当前页需要数据
        let datasql = `select * from ${tableName}`
        if (conditions.length > 0) {
            datasql += ' where ' + conditions.join(' AND ')
        }
        //分页筛选数据
        if (orderBy) {
            datasql += ` ${orderBy}`
        }
        datasql += ` limit ? offset ? `
        const finalparams = [...params, limit, offset]
        const [list] = await db.query(datasql, finalparams)
        //返回数据
        return ({
            list: list,
            page: parseInt(page),
            limit: limit,
            countTotal: countTotal,
            totalPage: totalPage,
        })

    } catch (err) {
        console.error('分页查询失败', err.message)
        return {
            list: [],
            page: 0,
            limit: 0,
            countTotal: 0,
            totalPage: 0
        }
    }
}