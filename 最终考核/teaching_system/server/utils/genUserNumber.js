
const db = require('../config/db').promise()

/**
 * 按角色自动生成自增编号
 * @param {string} role - 用户角色：admin/teacher/student
 * @returns {Promise<string>} 生成的编号：ADM001/TEA001/STU001
 */
async function genUserNumber(role) {
    // 1. 定义角色前缀
    const prefixMap = {
        admin: 'ADM',
        teacher: 'TEA',
        student: 'STU'
    }

    const prefix = prefixMap[role]
    if (!prefix) {
        throw new Error('无效的用户角色')
    }

    // 2. 查询当前角色的最大编号
    const [rows] = await db.query(
        `SELECT user_number FROM users 
     WHERE user_number LIKE ? 
     ORDER BY user_number DESC LIMIT 1`,
        [`${prefix}%`]
    )

    // 3. 生成下一个编号
    if (rows.length === 0) {
        // 该角色第一条数据，从 001 开始
        return `${prefix}001`
    }

    // 提取数字部分 +1，补3位零
    const maxNumStr = rows[0].user_number.replace(prefix, '')
    const nextNum = (parseInt(maxNumStr, 10) + 1).toString().padStart(3, '0')
    return `${prefix}${nextNum}`
}

module.exports = genUserNumber