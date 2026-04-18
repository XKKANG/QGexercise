// 日志
let currentLogPage = 1
async function renderLogsModule(containerId) {
    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = `
        <div class="module-part">
            <div class="part-header">
                <h3>操作日志</h3>
            </div>
            <div class="table-box">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>操作人</th>
                            <th>角色</th>
                            <th>操作类型</th>
                            <th>操作内容</th>
                            <th>操作时间</th>
                            <th>班级ID</th>
                        </thead>
                    <tbody id="log-tbody">
                        <tr><td colspan="6"> <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
        </td></tr>
                    </tbody>
                </table>
            </div>
            <div class="page-bottom" id="log-pagebottom"></div>
        </div>
    `

    await fetchLogs()
}

async function fetchLogs() {
    const tbody = document.getElementById('log-tbody')
    if (!tbody) return
    tbody.innerHTML = `<tr><td colspan="6">
        <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
    </td></tr>`

    const cacheKey = `logs_page_${currentLogPage}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        renderLogTable(data)
        renderLogPageBottom(data)
    }

    try {
        const url = `/log/list?page=${currentLogPage}`
        const data = await request(url)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        renderLogTable(data)
        renderLogPageBottom(data)
    } catch (err) {
        if (!cachedData) {
            tbody.innerHTML = `<tr><td colspan="6" class="error-text">加载失败：${err.message}</td></tr>`
        }
    }
}

function renderLogTable(data) {
    const tbody = document.getElementById('log-tbody')
    const list = data.list || []
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">暂无日志</td></tr>'
        return
    }
    let html = ''
    for (let log of list) {
        html += `
            <tr>
                <td>${log.user_number || ''}</td>
                <td>${log.role === 'admin' ? '管理员' : '教师'}</td>
                <td>${log.operation_type || ''}</td>
                <td>${log.content || ''}</td>
                <td>${log.create_time ? formatDate(log.create_time) : ''}</td>
                <td>${log.class_id || '-'}</td>
            </tr>
        `
    }
    tbody.innerHTML = html
}

function renderLogPageBottom(data) {
    const container = document.getElementById('log-pagebottom')
    if (!container) return
    const totalPage = data.totalPage || 1
    let html = ''
    for (let i = 1; i <= totalPage; i++) {
        html += `<button data-page="${i}" class="${i === currentLogPage ? 'active' : ''}">${i}</button>`
    }
    container.innerHTML = html
    // 给点击事件加防抖
    const handlePageClick = debounce((btn) => {
        currentLogPage = parseInt(btn.getAttribute('data-page'), 10)
        fetchLogs()
    }, 300)

    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            handlePageClick(btn)
        })
    })
}