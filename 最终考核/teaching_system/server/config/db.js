//数据库连接
const mysql = require('mysql2')

//连接
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'teaching_system',
})

//向外共享
module.exports = db