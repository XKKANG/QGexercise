//根据老师工号查找他绑定的班级
const db = require('../config/db').promise()

module.exports = async (teacher_id) => {
    const [results] = await db.query('select id from classes where teacher_id=?', [teacher_id])
    return results.length ? results[0].id : null
}