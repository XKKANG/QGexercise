// 获取用户信息，未登录则跳转
const user = JSON.parse(localStorage.getItem('user') || '{}')
if (!user.role) {
    window.location.href = 'index.html'
}
// 显示用户信息
document.getElementById('user-name').innerText = user.username
document.getElementById('user-role').innerText =
    user.role === 'admin' ? '教务主任' : (user.role === 'teacher' ? '班主任' : '学生')

//权限
const isAdmin = user.role === 'admin'
const isTeacher = user.role === 'teacher'
const isStudent = user.role === 'student'
const canEdit = isAdmin || isTeacher
const canEdit2 = isTeacher
const canEdit3 = isAdmin

//根据权限生成菜单
// 标签上面的自定义属性
const modules = [
    { id: 'scores', name: '成绩管理', roles: ['admin', 'teacher', 'student'] },
    { id: 'notices', name: '通知管理', roles: ['admin', 'teacher', 'student'] },
    { id: 'classes', name: '班级管理', roles: ['admin', 'teacher'] },
    { id: 'logs', name: '日志查看', roles: ['admin', 'teacher'] },
    { id: 'stats', name: '统计报表', roles: ['admin', 'teacher', 'student'] }
]

const navMenu = document.getElementById('nav-menu')
//菜单旁边的内容
let activeModule = 'scores' // 默认显示成绩模块

//功能函数
function buildMenu() {
    let html = ''
    modules.forEach(module => {
        //权限判断，是否可以访问菜单对应模块
        if (module.roles.includes(user.role)) {
            html += `<li data-module="${module.id}" class="${activeModule === module.id ? 'active' : ''}">${module.name}</li>`
        }
    })
    navMenu.innerHTML = html
    // 绑定点击事件
    document.querySelectorAll('[data-module]').forEach(item => {
        item.addEventListener('click', () => {
            const mod = item.getAttribute('data-module')
            switchModule(mod)
        })
    })
}

// 切换模块
function switchModule(moduleId) {
    currentView = moduleId
    activeModule = moduleId
    // 更新菜单高亮
    document.querySelectorAll('[data-module]').forEach(ele => {
        if (ele.getAttribute('data-module') === moduleId) {
            ele.classList.add('active')
        } else {
            ele.classList.remove('active')
        }
    })
    // 如果是通知模块，移除红点
    if (moduleId === 'notices') {
        removeNoticeBadge()
    }
    // 显示对应内容
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'))
    const activeView = document.getElementById(`${moduleId}-view`)
    if (activeView) activeView.classList.add('active')

    // 根据模块加载数据
    if (moduleId === 'scores') renderScoresModule('scores-view', canEdit)
    else if (moduleId === 'notices') renderNoticesModule('notices-view', canEdit2)
    else if (moduleId === 'classes') renderClassesModule('classes-view', canEdit3)
    else if (moduleId === 'logs') renderLogsModule('logs-view')
    else if (moduleId === 'stats') renderStatsModule('stats-view')

}

// 退出登录
document.querySelector('.btn-logout').addEventListener('click', logout)

// 移动端侧边栏折叠
const simulateBtn = document.querySelector('.simulate-btn');
const nav = document.querySelector('.nav');
const mainBody = document.querySelector('.main-body');

if (simulateBtn && nav) {
    // 点击按钮切换侧边栏的 open 类
    simulateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('open');
    });

    // 点击主体区域（.main-body）时关闭侧边栏
    if (mainBody) {
        mainBody.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    }

    // 点击侧边栏内部时阻止冒泡，避免误关闭
    nav.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}
// 初始化
buildMenu()
switchModule('scores')
//自动建立连接
connectWebSocket()