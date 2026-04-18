//userinfor路由函数
const db = require('../config/db').promise()
const genUserNumber = require('../utils/genUserNumber')

//当前用户信息
module.exports.getInfor = async (req, res) => {
    try {
        //检验用户是否存在
        const { user_number } = req.user
        const checksql = 'select id,username,role,class_id,user_number from users where user_number=?'
        const [results] = await db.query(checksql, [user_number])
        if (results.length === 0) return res.cc('该用户不存在')
        res.cc('获取用户信息成功', 0, results[0])
    } catch (err) { res.cc(err) }
}
//所有人信息
module.exports.getAllInfor = async (req, res) => {
    try {
        //获取信息
        const checksql = 'select id,username,class_id from users'
        const [results] = await db.query(checksql)
        res.cc('获取全部用户信息成功', 0, results)
    } catch (err) { res.cc(err) }
}