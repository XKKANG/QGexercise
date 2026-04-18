const db = require('../config/db').promise()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config_jwt')
const genUserNumber = require('../utils/genUserNumber')
//注册函数
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body
        //前面中间件已经验证格式是否正确

        //不能重复
        const checksql = 'select * from users where username=?'
        const [results] = await db.query(checksql, [username])

        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        //自动生成编号
        const user_number = await genUserNumber(role)
        //加密
        let pwd = bcrypt.hashSync(password, 10)
        //插入新用户
        const insertsql = 'insert into users (username, password, role, user_number, class_id) VALUES (?,?,?,?,NULL)'
        const [insertResults] = await db.query(insertsql, [username, pwd, role, user_number])
        if (insertResults.affectedRows !== 1) {
            return res.cc('用户注册失败，请稍后再试！')
        }
        res.cc('注册成功！', 0, { user_number: user_number })


    } catch (err) {
        res.cc(err)
    }

}
exports.login = async (req, res) => {
    try {
        const { username, user_number, password } = req.body
        const checksql = 'select * from users where username=? AND user_number=?'
        const [results] = await db.query(checksql, [username, user_number])
        //用户名对应检查

        if (results.length !== 1) {
            return res.cc('信息错误，登录失败！')
        }
        //密码检查
        const user = results[0]
        const checkpassword = bcrypt.compareSync(password, user.password)
        if (!checkpassword) {
            return res.cc('密码错误，登陆失败！')
        }
        //登录成功，服务器生成token给客户端
        const token = jwt.sign(
            {
                id: user.id,
                user_number: user.user_number,
                username: user.username,
                role: user.role,
                class_id: user.class_id
            },
            config.jwtSecretKey,
            { expiresIn: '7d' }
        )
        //响应
        res.cc('登录成功！', 0, {
            token: 'Bearer ' + token,
            user: {
                user_number: user.user_number,
                username: user.username,
                role: user.role,
                class_id: user.class_id
            }
        })

    } catch (err) {
        res.cc(err)
    }
}