// 统计
let statsCurrentClassId = null
let statsClassList = []
let statsKeyword = ''//搜索功能，存储关键词

//固定框架：管理员与  老师学生 不同
async function renderStatsModule(containerId) {
    const container = document.getElementById(containerId)
    if (!container) return

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const isAdmin = user.role === 'admin'

    if (isAdmin) {
        await renderClassListView(container)
    } else {
        // 学生/教师：获取自己的班级id
        let classId = user.class_id
        if (!classId && user.role === 'teacher') {
            // 教师需要从班级列表中查找自己所教班级
            try {
                const data = await request('/class/list?page=1&limit=100')
                const myClass = data.list.find(c => c.teacher_id === user.user_number)
                classId = myClass ? myClass.id : null
            } catch (err) {
                classId = null
            }
        }
        if (classId) {
            statsCurrentClassId = classId
            await renderStatsView(container, classId)
        } else {
            container.innerHTML = '<div class="module-part">您尚未绑定班级，无法查看统计</div>'
        }
    }
}

//管理员界面
async function renderClassListView(container) {
    container.innerHTML = `
        <div class="module-part">
            <div class="part-header">
                <h3>班级统计</h3>
                <div class="score-search">
                    <input type="text" id="stats-searchInput" placeholder="搜索班级名称" style="width: 200px;">
                    <button id="stats-searchBtn" class="btn-small">搜索</button>
                </div>
            </div>
            <div id="stats-classListContainer">加载中...</div>
            <div class="page-bottom" id="stats-classPageBottom"></div>
        </div>
    `
    await fetchClassListForStats(1)

    // 搜索防抖包装（300ms内只执行最后一次）
    const doStatsSearch = debounce(() => {
        statsKeyword = document.getElementById('stats-searchInput').value.trim()
        fetchClassListForStats(1)
    }, 300)

    document.getElementById('stats-searchBtn').addEventListener('click', doStatsSearch)
    document.getElementById('stats-searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            doStatsSearch()
        }
    })
}
//获取班级列表数据（增加了搜索功能）
async function fetchClassListForStats(page) {
    const container = document.getElementById('stats-classListContainer')
    if (!container) return

    // 显示骨架屏
    container.innerHTML = `
        <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
    `
    const user = JSON.parse(localStorage.getItem('user'))
    const userKey = user.user_number
    const cacheKey = `stats_classlist_${userKey}_page_${page}_kw_${statsKeyword || ''}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        statsClassList = data.list || []
        renderClassListTable(data)
        renderClassListPageBottom(data)
    }
    try {
        let url = `/class/list?page=${page}&limit=100`
        if (statsKeyword) {
            url += `&classname=${encodeURIComponent(statsKeyword)}`
        }
        const data = await request(url)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        statsClassList = data.list || []
        renderClassListTable(data)
        renderClassListPageBottom(data)
    } catch (err) {
        container.innerHTML = `<div class="error-text">加载失败：${err.message}</div>`
    }
}
//渲染班级列表
function renderClassListTable(data) {
    const container = document.getElementById('stats-classListContainer')
    const list = data.list || []
    if (list.length === 0) {
        container.innerHTML = '<div class="load-text">暂无班级</div>'
        return
    }
    let html = '<ul style="list-style:none; padding:0;">'
    for (let cls of list) {
        html += `
            <li style="padding:8px; margin:4px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <span>${cls.classname} ${cls.teacher_id ? `(班主任: ${cls.teacher_id})` : ''}</span>
                <button class="btn-small btn-viewStats" data-id="${cls.id}" data-name="${cls.classname}">查看统计</button>
            </li>
        `
    }
    html += '</ul>'
    container.innerHTML = html
    // 绑定查看统计按钮
    document.querySelectorAll('.btn-viewStats').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation()
            const classId = btn.getAttribute('data-id')
            const className = btn.getAttribute('data-name')
            statsCurrentClassId = classId

            const currentLi = btn.closest('li')
            document.querySelectorAll('#stats-classListContainer li').forEach(li => li.classList.remove('active'))
            if (currentLi) currentLi.classList.add('active')

            const container = document.getElementById('stats-view')
            if (container) {
                await renderStatsView(container, classId, className)
            }
        })
    })
}
//分页
function renderClassListPageBottom(data) {
    const container = document.getElementById('stats-classPageBottom')
    if (!container) return
    const totalPage = data.totalPage || 1
    const currentPage = data.page || 1
    let html = ''
    for (let i = 1; i <= totalPage; i++) {
        html += `<button data-page="${i}" class="${i === currentPage ? 'active' : ''}">${i}</button>`
    }
    container.innerHTML = html
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.getAttribute('data-page'), 10)
            fetchClassListForStats(page)
        })
    })
}


//三者看到相同的统计页面（左右分栏）
async function renderStatsView(container, classId, className = '') {
    if (!classId) return
    if (!className) {
        try {
            const data = await request(`/class/list?page=1&limit=100`)
            const cls = data.list.find(c => c.id == classId)
            className = cls ? cls.classname : '班级'
        } catch (e) { className = '班级' }
    }
    container.innerHTML = `
        <div class="module-part">
            <div class="part-header">
                <h3>成绩统计 - ${className}</h3>
                ${JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? '<button id="btn-backClassList" class="btn-small">返回班级列表</button>' : ''}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 24px;">
                <div class="divide1">
                    <h4>班级总体统计</h4>
                    <div id="stats-classOverall" style="margin-top: 16px;">加载中...</div>
                </div>
                <div class="divide2">
                    <h4>各科目统计</h4>
                    <div id="stats-subjectTable" style="margin-top: 16px;">加载中...</div>
                </div>
            </div>
        </div>
    `
    if (JSON.parse(localStorage.getItem('user')).role === 'admin') {
        document.getElementById('btn-backClassList').addEventListener('click', () => {
            renderClassListView(container)
        })
    }
    await fetchClassOverallStats(classId)
    await fetchAllSubjectsStats(classId)
}

//获取班级全部统计数据+渲染
async function fetchClassOverallStats(classId) {
    const container = document.getElementById('stats-classOverall')
    if (!container) return
    // 显示骨架屏
    container.innerHTML = `
        <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
    `
    const user = JSON.parse(localStorage.getItem('user'))
    const userKey = user.user_number
    const cacheKey = `stats_overall_${userKey}_class_${classId}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        if (!data || data.totalStudents === 0) {
            container.innerHTML = '<div class="load-text">暂无成绩数据</div>'
        } else {
            renderOverallStats(data, container)
        }
    }
    try {
        const data = await request(`/score/stats/class?class_id=${classId}`)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        if (!data || data.totalStudents === 0) {
            container.innerHTML = '<div class="load-text">暂无成绩数据</div>'
        } else {
            renderOverallStats(data, container)
        }
    } catch (err) {
        if (!cachedData) {
            container.innerHTML = `<div class="error-text">加载失败：${err.message}</div>`
        }
    }
}
function renderOverallStats(data, container) {
    const html = `
        <table class="data-table">
            <tbody>
                <tr><th>平均分</th><td>${data.avg}</div></tr>
                <tr><th>最高分</th><td>${data.max}</div></td>
                <tr><th>最低分</th><td>${data.min}</div></tr>
                <tr><th>及格人数</th><td>${data.passCount}</div></tr>
                <tr><th>及格率</th><td>${data.passRate}</div></tr>
                <tr><th>参考人数</th><td>${data.totalStudents}</div></tr>
            </tbody>
    `
    container.innerHTML = html
}
//科目数据获取+渲染
async function fetchAllSubjectsStats(classId) {
    const container = document.getElementById('stats-subjectTable')
    if (!container) return
    // 显示骨架屏
    container.innerHTML = `
        <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
    `
    const user = JSON.parse(localStorage.getItem('user'))
    const userKey = user.user_number
    const cacheKey = `stats_subjects_${userKey}_class_${classId}`

    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        renderSubjectsStats(data, container)
    }
    try {
        const data = await request(`/score/stats/subject?class_id=${classId}`)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        renderSubjectsStats(data, container)
    } catch (err) {
        if (!cachedData) {
            container.innerHTML = `<div class="error-text">加载失败：${err.message}</div>`
        }
    }
}
function renderSubjectsStats(data, container) {
    const subjects = data.subjects || []
    if (subjects.length === 0) {
        container.innerHTML = '<div class="load-text">暂无科目成绩</div>'
        return
    }
    let html = `
        <table class="data-table">
            <thead>
                <tr><th>科目</th><th>平均分</th><th>最高分</th><th>最低分</th><th>及格人数</th><th>及格率</th><th>参考人数</th></thead>
            <tbody>
    `
    for (let sub of subjects) {
        html += `
            <tr>
                <td>${sub.subject}</div>
                <td>${sub.avg}</div>
                <td>${sub.max}</div>
                <td>${sub.min}</div>
                <td>${sub.passCount}</div>
                <td>${sub.passRate}</div>
                <td>${sub.totalStudents}</div>
            </tr>
        `
    }
    html += '</tbody>能得到'
    container.innerHTML = html
}
