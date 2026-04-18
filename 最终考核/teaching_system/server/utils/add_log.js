const db = require('../config/db').promise()
module.exports = async (logs) => {
    try {
        const sql = 'insert into logs(user_number,username,role,operation_type,content,class_id) values(?,?,?,?,?,?)'
        await db.query(sql, logs)
        console.log('日志记录成功')

    } catch (err) {
        console.error('日志记录失败', err)
    }
}