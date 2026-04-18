// 通知模块
let currentNoticePage = 1
let canEditNotice = false
//整体框架
async function renderNoticesModule(containerId, canEdit) {
    canEditNotice = canEdit
    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = `
        <div class="module-part">
            <div class="part-header">
                <h3>班级通知</h3>
                ${canEditNotice ? '<button id="btn-publishNotice" class="btn-small">+ 发布通知</button>' : ''}
            </div>
            <div class="notice-list" id="notice-list">
               <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
            </div>
            <div class="page-bottom" id="notice-pagebottom"></div>
        </div>
    `

    if (canEditNotice) {
        const publishBtn = document.getElementById('btn-publishNotice')
        if (publishBtn) publishBtn.addEventListener('click', publishMenu)
    }

    await fetchNotices()
}

// 获取后端响应数据
async function fetchNotices() {
    const noticeList = document.getElementById('notice-list')
    if (!noticeList) return
    // 显示骨架屏
    noticeList.innerHTML = `
        <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
    `
    // 缓存
    const user = JSON.parse(localStorage.getItem('user'))
    const userKey = user.user_number
    const cacheKey = `notices_${userKey}_page_${currentNoticePage}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        renderNoticeList(data)
        renderNoticePageBottom(data)
    }

    try {
        let url = `/notice/list?page=${currentNoticePage}`
        const data = await request(url)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        renderNoticeList(data)
        renderNoticePageBottom(data)
    } catch (err) {
        if (!cachedData) {
            noticeList.innerHTML = `<div class="error-text">加载失败：${err.message}</div>`
        }
    }
}

//渲染通知列表-->只有学生才有已读未读
function renderNoticeList(data) {
    const noticeList = document.getElementById('notice-list')
    const list = data.list || []
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    //判断学生
    const isStudent = user.role === 'student'
    //未读优先排序
    if (isStudent && list.length > 0) {
        list.sort((a, b) => {
            if (a.is_read === b.is_read) return 0
            return a.is_read ? 1 : -1
        })
    }

    if (list.length === 0) {
        noticeList.innerHTML = '<div class="load-text">暂无通知</div>'
        return
    }

    let html = ''
    for (let item of list) {
        // 学生+已读未读
        const isUnread = isStudent && !item.is_read

        html += `
            <div class="notice-card ${isUnread ? 'unread' : ''}" data-id="${item.id}">
                <div class="notice-title">
                    <h4>${item.title}</h4>
                    ${isUnread ? '<span class="unread-sign">未读</span>' : ''}
                </div>
                <div class="notice-publisherInfor">
                    <span>发布时间：${formatDate(item.create_time)}</span>
                    <span>更新时间：${formatDate(item.update_time)}</span>
                </div>
                <div class="notice-abstract">${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</div>
                <div class="notice-detail" id="detail-${item.id}">${item.content}</div>
                ${canEditNotice ? `
                <div class="notice-operate">
                    <button class="btn-small btn-editNotice" data-id="${item.id}" data-title="${item.title}" data-content="${item.content}">编辑</button>
                    <button class="btn-small btn-smallDel btn-delNotice" data-id="${item.id}">删除</button>
                    <button class="btn-small btn-statsNotice" data-id="${item.id}">统计</button> 
                </div>
                ` : ''}
            </div>
        `
    }
    noticeList.innerHTML = html

    //绑定卡片：全部。-->点击展开/收起详情-->点开才算已读
    document.querySelectorAll('.notice-card').forEach(card => {
        const cardId = card.getAttribute('data-id')
        //原来卡片本身是否已读

        card.addEventListener('click', async (e) => {
            //只要不是点到button，都触发
            if (e.target.tagName === 'BUTTON') return

            const isUnreadCard = card.classList.contains('unread')
            // 先从本地数据中拿到这条通知的 is_read 状态
            const list = data.list || []
            const notice = list.find(item => item.id == cardId)
            const isRead = notice?.is_read === true
            card.classList.toggle('expand')
            //只有学生-->标记已读
            if (isStudent && isUnreadCard && !isRead) {
                try {
                    const user = JSON.parse(localStorage.getItem('user') || '{}')
                    const studentId = user.student_id || ''
                    await request('/notice/read', {
                        method: 'POST',
                        body: { id: cardId, student_id: studentId }
                    })

                    console.log(card.classList.remove('unread'))
                    const unreadSign = card.querySelector('.unread-sign')
                    if (unreadSign) unreadSign.remove()
                    // 标记已读成功后，直接展开卡片（不刷新列表）
                    card.classList.add('expand')
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' })
                } catch (err) {
                    console.error('标记已读失败', err)
                }
            }
        })
    })

    //绑定事件：老师权限
    if (canEditNotice) {
        //编辑
        document.querySelectorAll('.btn-editNotice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                //阻止冒泡，因为卡片绑定了点击
                e.stopPropagation()

                const id = btn.getAttribute('data-id')
                const title = btn.getAttribute('data-title')
                const content = btn.getAttribute('data-content')
                showEditMenu(id, title, content)
            })
        })
        //删除
        document.querySelectorAll('.btn-delNotice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation()
                const id = btn.getAttribute('data-id')
                deleteNotice(id)
            })
        })
        //统计
        document.querySelectorAll('.btn-statsNotice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation()
                const noticeId = btn.getAttribute('data-id')
                showNoticeStats(noticeId)
            })
        })
    }
}

//显示统计数据
async function showNoticeStats(noticeId) {
    try {
        // 获取统计数据
        const stats = await request(`/notice/stats/number?notice_id=${noticeId}`)
        // 获取已读未读名单
        const lists = await request(`/notice/stats/list?notice_id=${noticeId}`)

        const modalDiv = document.createElement('div')
        modalDiv.className = 'modal active'
        modalDiv.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <h3>通知统计</h3>
                <div style="margin: 16px 0; padding: 12px; background: #f5f5f5; border-radius: 8px;">
                    <p>总人数：${stats.total}</p>
                    <p>已读人数：${stats.readCount}</p>
                    <p>未读人数：${stats.unreadCount}</p>
                </div>
                <div style="display: flex; gap: 20px;">
                    <div style="flex:1;">
                        <h4>已读名单</h4>
                        <ul style="max-height: 200px; overflow-y: auto;">
                            ${lists.readList.map(item => `<li>${item.student_id} - ${item.student_name}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="flex:1;">
                        <h4>未读名单</h4>
                        <ul style="max-height: 200px; overflow-y: auto;">
                            ${lists.unreadList.map(item => `<li>${item.user_number} - ${item.username}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn modal-cancel" style="background:#ccc;">关闭</button>
                </div>
            </div>
        `
        document.body.appendChild(modalDiv)
        const closeBtn = modalDiv.querySelector('.modal-cancel')
        closeBtn.addEventListener('click', () => document.body.removeChild(modalDiv))
    } catch (err) {
        alert('获取统计失败：' + err.message)
    }
}

//渲染页码
function renderNoticePageBottom(data) {
    const container = document.getElementById('notice-pagebottom')
    if (!container) return
    const totalPage = data.totalPage || 1
    let html = ''

    for (let i = 1; i <= totalPage; i++) {
        html += `<button data-page="${i}" class="${i === currentNoticePage ? 'active' : ''}">${i}</button>`
    }

    container.innerHTML = html
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentNoticePage = parseInt(btn.getAttribute('data-page'), 10)
            fetchNotices()
        })
    })
}


//post相关
//发布通知弹窗
function publishMenu() {
    const content = `
        <div class="input-item">
            <label>标题</label>
            <input type="text" id="pub-title" placeholder="请输入通知标题" required>
        </div>
        <div class="input-item">
            <label>内容</label>
            <textarea id="pub-content" rows="5" placeholder="请输入通知内容" required></textarea>
        </div>
    `

    const modal = new Modal({
        title: '发布通知',
        content: content,
        confirmText: '确认发布',
        cancelText: '取消',
        onConfirm: async () => {
            const title = modal.element.querySelector('#pub-title').value.trim()
            const contentText = modal.element.querySelector('#pub-content').value.trim()
            const msg = modal.element.querySelector('.modal-message')

            try {
                await request('/notice/publish', {
                    method: 'POST',
                    body: { title, content: contentText }
                })
                modal.close()
                currentNoticePage = 1
                await fetchNotices()
            } catch (err) {
                showMessage(msg, err.message)
            }
        }
    })

    modal.render()
}

//编辑通知弹窗
function showEditMenu(id, oldTitle, oldContent) {
    const modal = new Modal({
        title: '编辑通知',
        content: `
    <div class="input-item">
            <label>标题</label>
            <input type="text" id="edit-title" value="${oldTitle}" required>
        </div>
        <div class="input-item">
            <label>内容</label>
            <textarea id="edit-content" rows="5" required>${oldContent}</textarea>
        </div>
    `,
        confirmText: '保存修改',
        onConfirm: async () => {
            const title = modal.element.querySelector('#edit-title').value.trim()
            const contentText = modal.element.querySelector('#edit-content').value.trim()
            const msg = modal.element.querySelector('.modal-message')
            try {
                await request('/notice/update', {
                    method: 'POST',
                    body: { id, title, content: contentText }
                })
                modal.close()
                await fetchNotices()
            } catch (err) {
                showMessage(msg, err.message)
            }
        }
    })
    modal.render()
}
//删除
async function deleteNotice(id) {
    const result = confirm('确认删除这条通知吗？')
    if (!result) return
    try {
        await request('/notice/delete', {
            method: 'POST',
            body: { id }
        })
        await fetchNotices()
    } catch (err) {
        alert('删除失败：' + err.message)
    }
}
