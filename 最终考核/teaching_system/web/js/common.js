//公共js
//全局变量
let currentView = null
const API_Address = 'http://127.0.0.1:8088/api'

//每次请求-->自动携带token-->通用函数
async function request(url, options = {}) {

    const token = localStorage.getItem('token')
    //初始化请求头-->JSON格式+token
    const headers = {
        'Content-Type': 'application/json'
    }
    if (token) {
        headers.Authorization = token
    }
    //发送请求的携带内容完整版
    const config = {
        method: options.method || 'GET',
        headers: headers
    }
    //post请求会有body内容
    if (options.body) {
        config.body = JSON.stringify(options.body)
    }

    //发送请求
    const response = await fetch(`${API_Address}${url}`, config)
    //获取服务器响应结果
    const results = await response.json()

    //res.cc
    // res.cc = function (err, status = 1, data = null) {
    //     res.send({
    //         status,
    //         message: err instanceof Error ? err.message : err,
    //         data: data,
    //     })
    // }

    //处理响应结果 0是成功
    if (results.status !== 0) {
        throw new Error(results.message || '请求失败')
    }
    return results.data
}

//退出登录
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    //跳转页面
    window.location.href = 'index.html'

}

//消息提示（对应res.cc的message）
function showMessage(element, content, isError = true) {
    element.innerHTML = content
    //默认提示为出错
    element.className = `message ${isError ? 'error' : 'success'}`
    //！！！设计思路-->延时！-->完善交互节奏，提升体验感
    setTimeout(() => {
        if (element.innerHTML === content) {
            element.innerHTML = ''
            element.className = 'message'
        }
    }, 5000)
}
//时间显示转换
function formatDate(isoString) {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleString()
}

// 通用弹窗组件
class Modal {
    //构造函数
    constructor({ title, content, confirmText = '确认', cancelText = '取消', onConfirm, onCancel }) {
        this.title = title
        this.content = content
        this.confirmText = confirmText
        this.cancelText = cancelText
        //自定义方法---(事件监听里的回调函数)---如果没有，就执行关闭
        this.onConfirm = onConfirm || (() => this.close())
        this.onCancel = onCancel || (() => this.close())
        //存dom元素
        this.element = null
    }
    //渲染
    render() {
        //先移除已存在弹窗
        this.close()

        //创建弹窗
        this.element = document.createElement('div')
        this.element.className = 'modal active'
        //渲染
        this.element.innerHTML = `
            <div class="modal-content">
                <h3>${this.title}</h3>
                <div class="modal-body">${this.content}</div>
                <div class="modal-message message"></div>
                <div class="modal-buttons">
                    <button class="btn modal-confirm">${this.confirmText}</button>
                    <button class="btn modal-cancel" style="background:#ccc;">${this.cancelText}</button>
                </div>
            </div>
        `
        document.body.appendChild(this.element)
        this.element.querySelector('.modal-confirm').onclick = () => this.onConfirm(this)
        this.element.querySelector('.modal-cancel').onclick = () => this.onCancel(this)
    }
    close() {
        this.element?.remove()
        this.element = null
    }
}
//通用表格组件
// class Table {
//     constructor(container, columns, operations = []) {
//         this.container = container
//         this.columns = columns
//         this.operations = this.operations
//         this.currentData = []      // 保存当前数据，供外部扩展使用
//     }

//     render(data) {
//         this.currentData = data
//         if (!this.container) return

//         // 计算列数-->数据列 + 操作列
//         const colCount = this.columns.length + (this.operations.length > 0 ? 1 : 0)

//         // 数据不存在
//         if (this.currentData.length === 0) {
//             this.container.innerHTML = `<tr><td colspan="${colCount}" class="load-text">暂无数据</td></tr>`
//             return
//         }

//         // 渲染行
//         // 数据例子
//         // // 列定义
//         // const columns = [
//         //     { field: 'student_id', title: '学号' },
//         //     { field: 'name', title: '姓名' },
//         //     { field: 'score', title: '分数' }
//         // ];

//         // // 操作按钮配置
//         // const operations = [
//         //     { text: '编辑', class: 'btn-edit', onClick: (row) => console.log('编辑', row) },
//         //     { text: '删除', class: 'btn-delete', onClick: (row) => console.log('删除', row) }
//         // ];

//         // // 数据
//         // const currentData = [
//         //     { student_id: '001', name: '张三', score: 90 },
//         //     { student_id: '002', name: '李四', score: 85 }
//         // ];
//         let html = ''
//         for (const row of this.currentData) {
//             html += '<tr>'
//             // 数据列
//             for (const col of this.columns) {
//                 html += `<td>${row[col.field]}</td>`
//             }
//             // 操作列
//             if (this.operations.length) {
//                 let btnsHtml = ''
//                 for (let i = 0; i < this.operations.length; i++) {
//                     btnsHtml += `<button class="${this.operations[i].class} btn-small" data-index="${i}">${this.operations.text}</button> `;
//                 }
//                 html += `<td>${btnsHtml}</td>`
//             }
//             html += '</tr>'
//         }
//         this.container.innerHTML = html

//         // 事件委托绑定按钮
//         this.container.onclick = (e) => {
//             if (!e.target.matches('button')) return
//             const tr = e.target.closest('tr')
//             if (!tr) return
//             //所有行-->排成数组
//             const rows = Array.from(this.container.querySelectorAll('tr'))
//             //点击的这一行的索引号为
//             const rowIndex = rows.indexOf(tr)
//             const rowData = this.currentData[rowIndex]
//             const dataIndex = e.target.dataset.index;
//             if (this.operations[dataIndex]) {
//                 e.stopPropagation()
//                 this.operations[dataIndex].onClick(rowData)
//             }

//         }

//     }
//     // 更新数据重新渲染
//     setData(data) {
//         this.render(data);
//     }
// }
// 和websocket建立连接
let ws = null
let heartbeatTimer = null
function connectWebSocket() {
    //只有学生且已经分配班级才连接（获得该班级实时刷新数据）
    const user = JSON.parse(localStorage.getItem('user'))
    if (user.role !== 'student' || !user.class_id) {
        return
    }

    const wsUrl = 'ws://127.0.0.1:8088'
    ws = new WebSocket(wsUrl)
    //连接成功
    ws.onopen = () => {
        console.log('WebSocket 已连接')
        //向服务器发送基本信息
        ws.send(JSON.stringify({
            type: 'register',
            classId: user.class_id,
            userId: user.user_number
        }))
        // 心跳-->确保连接
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer)
        }
        heartbeatTimer = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'ping' }))
            }
        }, 30000)
    }
    //接收服务器发来的信息
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            //通知板块信号
            if (data.type === 'notice_new' || data.type === 'notice_update' || data.type === 'notice_delete') {
                // 桌面提醒（仅新通知）
                if (data.type === 'notice_new') {
                    if (Notification.permission === 'granted') {
                        new Notification('新通知', { body: '您有一条新的班级通知' });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(perm => {
                            if (perm === 'granted') new Notification('新通知', { body: '您有一条新的班级通知' });
                        });
                    }
                }

                //判断是否在通知页面
                if (currentView === 'notices') {
                    fetchNotices()

                } else {
                    showNoticeBadge()
                }
            }
            else if (data.type === 'score_update') {
                if (currentView === 'scores') {
                    fetchScores()
                }
            }
        } catch (err) {
            console.error('WebSocket 消息解析失败', err)
        }


    }
    // 连接关闭
    ws.onclose = () => {
        console.log('WebSocket 已断开')
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer)
        }
    }
    // 连接错误
    ws.onerror = (err) => {
        console.error('WebSocket 错误', err.message)
    }
}
// 防抖：延迟执行，频繁触发只执行最后一次
function debounce(fn, delay = 300) {
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
// 菜单红点
function showNoticeBadge() {
    const noticeMenuItem = document.querySelector('[data-module="notices"]')
    if (!noticeMenuItem) return
    if (noticeMenuItem.querySelector('.notice-badge')) return
    const badge = document.createElement('span')
    badge.classList.add('notice-badge')
    noticeMenuItem.appendChild(badge)
}

function removeNoticeBadge() {
    const noticeMenuItem = document.querySelector('[data-module="notices"]');
    const badge = noticeMenuItem?.querySelector('.notice-badge')
    if (badge) badge.remove()
}