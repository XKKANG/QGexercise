const WebSocket = require('ws')
// 存WebSocket服务器实例
let wss = null
// 存储连接了的 所有客户端
// -->精准到班级。key 是 WebSocket 对象，value 是 { classId, userId }
const clients = new Map()

// 初始化WebSocket服务器
module.exports.initWebSocket = (server) => {
    //创建WebSocket服务器，附在http服务器上
    wss = new WebSocket.Server({ server })

    // 监听客户端连接事件
    wss.on('connection', (ws, req) => {
        console.log('WebSocket客户端已连接')
        // 监听客户端发来的消息
        ws.on('message', (message) => {
            try {
                // 解析收到的消息
                const data = JSON.parse(message)
                // 判断这是什么请求
                if (data.type === 'register') {
                    ws.classId = data.classId
                    ws.userId = data.userId
                    // 存进去map
                    clients.set(ws, { classId: ws.classId, userId: ws.userId })
                    console.log(`客户端注册: classId=${ws.classId}, userId=${ws.userId}`)
                } else if (data.type === 'ping') {
                    // 心跳响应：客户端定期发送 ping，服务器回复 pong
                    ws.send(JSON.stringify({ type: 'pong' }))
                }
            } catch (err) {
                console.error('WebSocket 消息解析失败', err)
            }
        })
        // 监听客户端断开连接
        ws.on('close', () => {
            // 从map中删除该客户端
            clients.delete(ws)
            console.log('WebSocket 客户端断开')
        })
    })
}
// 数据变化-->向所有连接的客户端 发送数据
module.exports.broadcastToClass = (classId, message) => {
    if (!wss) return
    const msgStr = JSON.stringify(message)
    // 遍历
    clients.forEach((value, client) => {
        // 检查这个客户端连接是否仍然处于打开状态（没有断开）
        if (value.classId == classId && client.readyState === WebSocket.OPEN) {
            //向客户端发消息
            client.send(msgStr)
        }
    })
}