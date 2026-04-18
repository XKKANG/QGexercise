//成绩模块内容渲染
let currentScorePage = 1
let canEditScore = false//默认无权限，除非传入有内容才能
let currentOrderBy = ''

//整体框架（固定）-->根据权限不同，渲染出的功能按钮不同
async function renderScoresModule(containerId, wethercanEdit) {
    //渲染查询成绩固定框架
    canEditScore = wethercanEdit
    const container = document.getElementById(containerId)
    if (!container) return
    container.innerHTML = `
    <div class="module-part">
            <div class="part-header">
                <h3>成绩管理</h3>
                ${canEditScore ? '<button id="btn-addScore" class="btn-small">+ 单条添加成绩</button>' : ''}
                ${canEditScore ? '<button id="btn-batchAddScore" class="btn-small">+ 批量添加成绩</button>' : ''}
             ${canEditScore ? '<button id="btn-exportScore" class="btn-small">📎 导出成绩</button>' : ''}
                <div class="score-search">
                    <select class="search-orderBy" id="search-orderBy" required>
                        <option value=""selected>默认排序</option>
                        <option value="student_id">按学号排序</option>
                        <option value="subject">按科目排序</option>
                         <option value="class_id">按班级排序</option>
                    </select>
                </div>
            </div>
            <div class="table-box">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>学号</th>
                            <th>姓名</th>
                            <th>班级</th>
                            <th>科目</th>
                            <th>分数</th>
                            ${canEditScore ? '<th>操作</th>' : ''}
                        </tr>
                    </thead>
                    <tbody id="score-tbody">
                        <tr><td colspan="6"> <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div></td></tr>
                    </tbody>
                </table>
            </div>
            <div class="page-bottom" id="score-pagebottom"></div>
        </div>
    `

    //事件绑定
    const searchOrderBy = document.getElementById('search-orderBy')
    //选取排序方式
    if (searchOrderBy) {
        const handleSortChange = debounce(() => {
            currentOrderBy = searchOrderBy.value
            currentScorePage = 1
            fetchScores()
        }, 300)
        // 绑定事件
        searchOrderBy.addEventListener('change', handleSortChange)
    }

    //添加导出成绩-->权限判断
    if (canEditScore) {
        const addBtn = document.getElementById('btn-addScore')
        if (addBtn) addBtn.addEventListener('click', addScoreMenu)
        const batchBtn = document.getElementById('btn-batchAddScore')
        if (batchBtn) batchBtn.addEventListener('click', batchAddScoreMenu)
        const exportBtn = document.getElementById('btn-exportScore')
        if (exportBtn) exportBtn.addEventListener('click', exportScores)
    }

    //获取后端响应数据
    await fetchScores()
}


//获取后端响应数据-->请求+处理获取
async function fetchScores() {
    const tbody = document.getElementById('score-tbody')
    if (!tbody) return
    // 显示骨架屏
    tbody.innerHTML = `<tr><td colspan="6">
        <div class="skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
        </div>
    </div>`
    // 读缓存
    const user = JSON.parse(localStorage.getItem('user'))
    const userKey = user.user_number
    const cacheKey = `scores_${userKey}_page_${currentScorePage}_order_${currentOrderBy || 'default'}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        renderScoreTable(data)
        renderScorePageBottom(data)
    }
    //获取后端响应数据
    try {
        //请求
        let url = `/score/list?page=${currentScorePage}`
        if (currentOrderBy) {
            url += `&order_by=${currentOrderBy}`
        }
        const data = await request(url)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        //处理获取
        renderScoreTable(data)
        renderScorePageBottom(data)
    } catch (err) {
        if (!cachedData) {
            tbody.innerHTML = `<tr><td colspan="6" class="error-text">加载失败：${err.message}</td></tr>`
        }
    }
}

//处理获取的响应数据（渲染）
//渲染成绩数据
function renderScoreTable(data) {
    const tbody = document.getElementById('score-tbody')
    const list = data.list || []
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">暂无数据</td></tr>'
        return
    }

    //渲染
    let html = ''
    for (let item of list) {
        html += `<tr>
            <td>${item.student_id}</td>
            <td>${item.username || '-'}</td>
            <td>${item.class_id}</td>
            <td>${item.subject}</td>
            <td>${item.score}</td>`
        if (canEditScore) {
            html += `<td>
                <button class="btn-small btn-edit" data-id="${item.student_id}" data-subject="${item.subject}" data-score="${item.score}" style="margin-right:10px">编辑</button>
                <button class="btn-small btn-smallDel btn-del" data-id="${item.student_id}" data-subject="${item.subject}">删除</button>
            </td>`
        }
        html += `</tr>`
    }
    tbody.innerHTML = html

    //管理者或者老师
    if (canEditScore) {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const student_id = btn.getAttribute('data-id')
                const subject = btn.getAttribute('data-subject')
                const oldScore = btn.getAttribute('data-score')
                editScore(student_id, subject, oldScore)
            })
        })
        document.querySelectorAll('.btn-del').forEach(btn => {
            btn.addEventListener('click', () => {
                const student_id = btn.getAttribute('data-id')
                const subject = btn.getAttribute('data-subject')
                deleteScore(student_id, subject)
            })
        })
    }
}

//渲染页码
function renderScorePageBottom(data) {
    const container = document.getElementById('score-pagebottom')
    if (!container) return
    //页码渲染
    const totalPage = data.totalPage || 1
    let html = ''

    for (let i = 1; i <= totalPage; i++) {
        html += `<button data-page="${i}" class="${i === currentScorePage ? 'active' : ''}">${i}</button>`
    }
    container.innerHTML = html
    //页码点击事件
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            //字符串转成十进制！
            currentScorePage = parseInt(btn.getAttribute('data-page'), 10)
            fetchScores()
        })
    })
}


//导出
async function exportScores() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const isAdmin = user.role === 'admin'

        // 获取班级列表
        const classData = await request('/class/list?page=1&limit=100')
        const classList = classData.list || []

        // 创建弹窗
        const modalDiv = document.createElement('div')
        modalDiv.className = 'modal active'
        modalDiv.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h3>导出成绩</h3>
                <div class="input-item">
                    <label>导出方式</label>
                    <select id="export-type">
                        <option value="class">按班级导出</option>
                        <option value="subject">按科目导出</option>
                    </select>
                </div>
                <div class="input-item" id="export-class-container">
                    <label>选择班级</label>
                    <select id="export-class-id">
                        <option value="">请选择班级</option>
                        ${classList.map(c => `<option value="${c.id}">${c.classname}</option>`).join('')}
                    </select>
                </div>
                <div class="input-item" id="export-subject-container" style="display:none;">
                    <label>选择科目</label>
                    <select id="export-subject">
                        <option value="">请先选择班级</option>
                    </select>
                </div>
                <div class="modal-buttons">
                    <button class="btn modal-confirm">确认导出</button>
                    <button class="btn modal-cancel" style="background:#ccc;">取消</button>
                </div>
                <div class="message modal-message"></div>
            </div>
        `
        document.body.appendChild(modalDiv)

        const typeSelect = modalDiv.querySelector('#export-type')
        const classContainer = modalDiv.querySelector('#export-class-container')
        const subjectContainer = modalDiv.querySelector('#export-subject-container')
        const classSelect = modalDiv.querySelector('#export-class-id')
        const subjectSelect = modalDiv.querySelector('#export-subject')

        // 切换导出方式
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'class') {
                classContainer.style.display = 'block'
                subjectContainer.style.display = 'none'
            } else {
                classContainer.style.display = 'block'  // 仍然显示班级选择（需要班级来确定科目）
                subjectContainer.style.display = 'block'
                // 当班级变化时，动态加载科目
                loadSubjects()
            }
        })

        // 加载科目的函数
        async function loadSubjects() {
            const classId = classSelect.value
            if (!classId) {
                subjectSelect.innerHTML = '<option value="">请先选择班级</option>'
                return
            }
            try {
                const subjects = await request(`/score/subjects?class_id=${classId}`)
                let options = '<option value="">请选择科目</option>'
                subjects.forEach(s => {
                    options += `<option value="${s}">${s}</option>`
                })
                subjectSelect.innerHTML = options
            } catch (err) {
                subjectSelect.innerHTML = '<option value="">加载失败</option>'
            }
        }

        classSelect.addEventListener('change', () => {
            if (typeSelect.value === 'subject') loadSubjects()
        })

        const confirmBtn = modalDiv.querySelector('.modal-confirm')
        const cancelBtn = modalDiv.querySelector('.modal-cancel')
        const msg = modalDiv.querySelector('.modal-message')

        confirmBtn.addEventListener('click', async () => {
            const exportType = typeSelect.value
            const classId = classSelect.value
            if (!classId) {
                msg.innerText = '请选择班级'
                msg.className = 'message error'
                return
            }
            let url = `/score/export?class_id=${classId}`
            if (exportType === 'subject') {
                const subject = subjectSelect.value
                if (!subject) {
                    msg.innerText = '请选择科目'
                    msg.className = 'message error'
                    return
                }
                url += `&subject=${encodeURIComponent(subject)}`
            }

            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${API_Address}${url}`, {
                    method: 'GET',
                    headers: { 'Authorization': token }
                })
                if (!response.ok) throw new Error('导出失败')
                const contentType = response.headers.get('content-type')
                if (contentType && contentType.includes('application/json')) {
                    const errData = await response.json()
                    throw new Error(errData.message || '导出失败')
                }
                const blob = await response.blob()
                const contentDisposition = response.headers.get('Content-Disposition')
                let filename = '成绩表.xlsx'
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
                    if (match && match[1]) {
                        filename = match[1].replace(/['"]/g, '')
                        filename = decodeURIComponent(filename)
                    }
                }
                const urlBlob = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = urlBlob
                a.download = filename
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(urlBlob)
                document.body.removeChild(modalDiv)
                alert('导出成功')
            } catch (err) {
                msg.innerText = err.message
                msg.className = 'message error'
            }
        })

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modalDiv)
        })
    } catch (err) {
        alert('初始化失败：' + err.message)
    }
}




//post相关

//添加成绩
//管理员老师添加学生成绩弹窗
function addScoreMenu() {
    const modal = new Modal({
        title: '添加成绩',
        content: `
            <div class="input-item"><label>学号</label><input id="stuId" placeholder="STU001" required></div>
            <div class="input-item"><label>科目</label><input id="subject" placeholder="数学/..." required></div>
            <div class="input-item"><label>分数</label><input id="score" type="number" step="0.01" required></div>
        `,
        confirmText: '添加',
        onConfirm: async () => {
            const student_id = modal.element.querySelector('#stuId').value.trim()
            const subject = modal.element.querySelector('#subject').value.trim()
            const score = parseFloat(modal.element.querySelector('#score').value)
            const msg = modal.element.querySelector('.modal-message')
            try {
                await request('/score/add/single', { method: 'POST', body: { student_id, subject, score } })
                modal.close()
                await fetchScores()
            } catch (err) {
                showMessage(msg, err.message)
            }
        }
    })
    modal.render()
}
function batchAddScoreMenu() {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal active';
    modalDiv.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <h3>批量添加成绩</h3>
            <div class="input-item">
                <label>成绩数据（每行格式：学号,科目,分数）</label>
                <textarea id="batch-data" rows="8" placeholder="示例：&#10;STU001,数学,85&#10;STU001,语文,92&#10;STU002,数学,78" style="font-family: monospace;"></textarea>
            </div>
            <div id="batch-message" class="message" style="margin-top: 12px; min-height: 24px;"></div>
            <div class="modal-buttons">
                <button class="btn modal-confirm">批量提交</button>
                <button class="btn modal-cancel" style="background:#ccc;">取消</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);

    const textarea = modalDiv.querySelector('#batch-data');
    const msgDiv = modalDiv.querySelector('#batch-message');
    const confirmBtn = modalDiv.querySelector('.modal-confirm');
    const cancelBtn = modalDiv.querySelector('.modal-cancel');



    // 确认提交
    confirmBtn.addEventListener('click', async () => {
        const raw = textarea.value.trim();
        if (!raw) {
            showMessage(msgDiv, '请输入数据', true);
            return;
        }
        const lines = raw.split(/\r?\n/);
        const list = [];
        const errors = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') continue;
            const parts = line.replace(/，/g, ',').split(',')
            if (parts.length !== 3) {
                errors.push(`第${i + 1}行格式错误：必须为“学号,科目,分数”`);
                continue;
            }
            const student_id = parts[0].trim();
            const subject = parts[1].trim();
            const score = parseFloat(parts[2].trim());
            if (isNaN(score)) {
                errors.push(`第${i + 1}行分数不是数字`);
                continue;
            }
            list.push({ student_id, subject, score });
        }
        if (errors.length > 0) {
            showMessage(msgDiv, errors.join('；'), true);
            return;
        }
        if (list.length === 0) {
            showMessage(msgDiv, '没有有效数据', true);
            return;
        }
        try {
            await request('/score/add/batch', { method: 'POST', body: { list } });
            modalDiv.remove();
            await fetchScores();
            alert(`成功添加 ${list.length} 条成绩`);
        } catch (err) {
            showMessage(msgDiv, '请检查是否重复添加同一成绩', true);
        }
    });

    cancelBtn.addEventListener('click', () => {
        modalDiv.remove();
    });
}
//编辑
async function editScore(student_id, subject, oldScore) {
    const newScore = prompt(`请输入 ${student_id} 的 ${subject} 新分数（当前 ${oldScore}）`, oldScore)
    if (newScore === null) return
    const score = parseFloat(newScore)
    if (isNaN(score)) {
        alert('分数必须是数字')
        return
    }
    try {
        await request('/score/update', {
            method: 'POST',
            body: { student_id, subject, score }
        })
        await fetchScores()
    } catch (err) {
        alert('修改失败：' + err.message)
    }
}
//删除
async function deleteScore(student_id, subject) {
    const result = confirm(`确认删除 ${student_id} 的 ${subject} 成绩吗？`)
    if (!result) return
    try {
        await request('/score/delete', {
            method: 'POST',
            body: { student_id, subject }
        })
        await fetchScores()
    } catch (err) {
        alert('删除失败：' + err.message)
    }
}