let currentClassPage = 1
let currentMemberPage = 1
let currentSelectedClassId = null
// 默认没有权限
let canEditClass = false
//整体框架
async function renderClassesModule(classListContentId, canEdit) {
    canEditClass = canEdit
    const classListContent = document.getElementById(classListContentId)
    if (!classListContent) return

    classListContent.innerHTML = `
    <div class="module-part">
        <div class="part-header">
            <h3>班级管理</h3>
            ${canEditClass ? '<button id="btn-addClass" class="btn-small">+ 新增班级</button>' : ''}
        </div>

        <div class="class-list">
            <div class="part-header">
                <h4>班级列表</h4>
                ${canEditClass ? '<button id="btn-bindTeacher" class="btn-small">+ 绑定教师</button>' : ''}
            </div>
            <div id="class-listContent">
                <div class="skeleton">
                    <div class="skeleton-row"></div>
                    <div class="skeleton-row"></div>
                    <div class="skeleton-row"></div>
                </div>
            </div>
            <div class="page-bottom" id="class-pagebottom"></div>
        </div>

        <div class="member-list">
            <div class="part-header">
                <h4>班级成员 <span id="class-name"></span></h4>
                <div id="member-operate"></div>
            </div>
            <div id="member-listContent">请先选择一个班级</div>
            <div class="page-bottom" id="member-pagebottom"></div>
        </div>
    </div>
`

    if (canEditClass) {
        //添加班级
        document.getElementById('btn-addClass').addEventListener('click', addClassMenu)
        //绑定老师
        document.getElementById('btn-bindTeacher').addEventListener('click', () => bindTeacherMenu(currentSelectedClassId))
    }

    await fetchClassList()
}

//获取班级列表
async function fetchClassList() {
    const classListContent = document.getElementById('class-listContent')
    if (!classListContent) return
    // 显示骨架屏
    classListContent.innerHTML = `
     <div class="skeleton">
    <div class="skeleton-row"></div>
    <div class="skeleton-row"></div>
    <div class="skeleton-row"></div>
    </div>
    `
    // 先读取缓存-->分页缓存
    const cacheKey = `classList_page_${currentClassPage}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        // 用缓存数据渲染-->不用请求
        renderClassList(data)
        renderClassPageBottom(data)
    }
    // 是否联网-->请求是否成功-->成功，重新渲染
    try {
        const url = `/class/list?page=${currentClassPage}`
        const data = await request(url)
        //更新缓存
        localStorage.setItem(cacheKey, JSON.stringify(data))
        renderClassList(data)
        renderClassPageBottom(data)
    } catch (err) {
        //请求失败且没有缓存-->报错
        if (!cachedData) {
            classListContent.innerHTML = `<div class="error-text">加载失败：${err.message}</div>`
        }
    }
}




//渲染班级列表
function renderClassList(data) {
    const classListContent = document.getElementById('class-listContent')
    const list = data.list || []
    if (list.length === 0) {
        classListContent.innerHTML = '<div class="load-text">暂无班级</div>'
        return
    }
    let html = '<ul style="list-style:none; padding:0;">'
    for (let cls of list) {
        html += `
        <li style="padding:8px; margin:4px 0; border-bottom:1px solid var(--border); cursor:pointer; display: flex; justify-content: space-between; align-items: center;"
        data-classId="${cls.id}" data-className="${cls.classname}">
        <span>${cls.classname} ${cls.teacher_id ? `(班主任: ${cls.teacher_id})` : ''}</span>
            <div>
                ${canEditClass && cls.teacher_id ? `<button class="btn-small btn-unbindTeacher" data-id="${cls.id}" data-name="${cls.classname}" data-teacher="${cls.teacher_id}" style="margin-right:8px;">解绑老师</button>` : ''}
                 ${canEditClass ? `<button class="btn-small btn-smallDel btn-delClass" data-id="${cls.id}" data-name="${cls.classname}">删除班级</button>` : ''}
            </div>
        </li>
        `
    }
    html += '</ul>'
    classListContent.innerHTML = html

    //点击班级-->获取数据-->显示对应班级成员列表
    document.querySelectorAll('#class-listContent li').forEach(li => {
        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delClass')) return
            document.querySelectorAll('#class-listContent li').forEach(l => l.classList.remove('active'))
            li.classList.add('active')
            currentMemberPage = 1
            const classId = li.getAttribute('data-classId')
            const className = li.getAttribute('data-className')
            currentSelectedClassId = classId
            document.getElementById('class-name').innerText = ` - ${className}`
            fetchMemberList(classId)
        })
    })

    //删除班级
    if (canEditClass) {
        document.querySelectorAll('.btn-delClass').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation()
                const classId = btn.getAttribute('data-id')
                const className = btn.getAttribute('data-name')
                if (confirm(`确认删除班级「${className}」吗？`)) {
                    try {
                        await request('/class/delete', {
                            method: 'POST',
                            body: { class_id: classId }
                        })
                        await fetchClassList()
                        if (currentSelectedClassId == classId) {
                            currentSelectedClassId = null
                            document.getElementById('class-name').innerText = ''
                            document.getElementById('member-listContent').innerHTML = '请先选择一个班级'
                            document.getElementById('member-operate').innerHTML = ''
                        }
                    } catch (err) {
                        alert('删除失败：' + err.message)
                    }
                }
            })
        })
    }

    //解绑老师
    document.querySelectorAll('.btn-unbindTeacher').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation()
            const classId = btn.getAttribute('data-id')
            const className = btn.getAttribute('data-name')
            const teacherId = btn.getAttribute('data-teacher')
            if (confirm(`确认将班主任 ${teacherId} 从班级「${className}」解绑吗？`)) {
                try {
                    await request('/class/unbind-teacher', {
                        method: 'POST',
                        body: { class_id: classId }
                    })
                    // 刷新班级列表-->更新班主任显示
                    await fetchClassList()
                    if (currentSelectedClassId == classId) {
                        // 重新获取成员列表-->更改班主任信息
                        await fetchMemberList(classId)
                    }
                } catch (err) {
                    alert('解绑失败：' + err.message)
                }
            }
        })
    })
}
//班级列表页码
function renderClassPageBottom(data) {
    const container = document.getElementById('class-pagebottom')
    if (!container) return
    const totalPage = data.totalPage || 1
    let html = ''
    for (let i = 1; i <= totalPage; i++) {
        html += `<button data-page="${i}" class="${i === currentClassPage ? 'active' : ''}">${i}</button>`
    }
    container.innerHTML = html
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentClassPage = parseInt(btn.getAttribute('data-page'), 10)
            fetchClassList()
        })
    })
}

//获取学生列表-->渲染
async function fetchMemberList(classId) {
    const memberListContent = document.getElementById('member-listContent')
    if (!memberListContent) return
    memberListContent.innerHTML = `
    <div class="skeleton">
    <div class="skeleton-row"></div>
    <div class="skeleton-row"></div>
    </div>
    `
    // 读取缓存
    const cacheKey = `memberList_class_${classId}_page_${currentMemberPage}`
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
        const data = JSON.parse(cachedData)
        renderMemberList(data)
        renderMemberPageBottom(data)
    }

    try {
        const url = `/class/members?class_id=${classId}&page=${currentMemberPage}`
        const data = await request(url)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        renderMemberList(data)
        renderMemberPageBottom(data)
    } catch (err) {
        if (!cachedData) {
            memberListContent.innerHTML = `<div class="error-text">加载失败：${err.message}</div>`
        }
    }
}

// //渲染班级成员
function renderMemberList(data) {
    const memberListContent = document.getElementById('member-listContent')
    const list = data.list || []

    //渲染成员表格
    if (list.length === 0) {
        memberListContent.innerHTML = '<div class="load-text">暂无成员</div>'
    } else {
        let html = `
            <table class="data-table">
                <thead><tr><th>学号/工号</th><th>姓名</th>${canEditClass ? '<th>操作</th>' : ''}</tr></thead>
                <tbody>
        `
        for (let member of list) {
            html += `
                <tr>
                    <td>${member.user_number}</td>
                    <td>${member.username}</td>
                    ${canEditClass ? `<td>
                        <button class="btn-small btn-smallDel btn-removeMember" data-id="${member.user_number}">移除</button>
                        <button class="btn-small btn-editMember" data-id="${member.user_number}" data-name="${member.username}">编辑</button>
                    </td>` : ''}
                </tr>
            `
        }
        html += '</tbody></table>'
        memberListContent.innerHTML = html
    }

    //添加学生
    const memberOperate = document.getElementById('member-operate')
    if (memberOperate) {
        if (canEditClass && currentSelectedClassId) {
            // 确保每次重新渲染时重新生成按钮，避免事件重复绑定
            memberOperate.innerHTML = `
                <button id="btn-addMember" class="btn-small">+ 添加学生</button>
            `
            // 添加学生事件
            const addBtn = document.getElementById('btn-addMember')
            if (addBtn) {
                // 移除旧事件，避免重复监听
                const newAddBtn = addBtn.cloneNode(true)
                addBtn.parentNode.replaceChild(newAddBtn, addBtn)
                newAddBtn.addEventListener('click', () => addMemberMenu(currentSelectedClassId))
            }

        } else if (!canEditClass) {
            memberOperate.innerHTML = ''
        }
    }

    //绑定移除和编辑事件
    if (canEditClass) {
        document.querySelectorAll('.btn-removeMember').forEach(btn => {
            btn.removeEventListener('click', handleRemove) // 防止重复
            btn.addEventListener('click', handleRemove)
        })
        document.querySelectorAll('.btn-editMember').forEach(btn => {
            btn.removeEventListener('click', handleEdit)
            btn.addEventListener('click', handleEdit)
        })
    }

    // 事件处理函数定义
    async function handleRemove(e) {
        e.stopPropagation()
        const userId = e.currentTarget.getAttribute('data-id')
        if (confirm(`确认将 ${userId} 移出班级吗？`)) {
            try {
                await request('/class/members/remove', {
                    method: 'POST',
                    body: { user_number: userId }
                })
                await fetchMemberList(currentSelectedClassId)
            } catch (err) {
                alert('移除失败：' + err.message)
            }
        }
    }

    async function handleEdit(e) {
        e.stopPropagation()
        const userId = e.currentTarget.getAttribute('data-id')
        const oldName = e.currentTarget.getAttribute('data-name')
        const newName = prompt('请输入新的姓名', oldName)
        if (newName && newName.trim() !== oldName) {
            try {
                await request('/class/members/update', {
                    method: 'POST',
                    body: { user_number: userId, username: newName.trim() }
                })
                await fetchMemberList(currentSelectedClassId)
            } catch (err) {
                alert('修改失败：' + err.message)
            }
        }
    }
}

// function renderMemberList(data) {
//     const memberListContent = document.getElementById('member-listContent')
//     const list = data.list || []
//     if (list.length === 0) {
//         memberListContent.innerHTML = '<div class="load-text">暂无成员</div>'
//         return
//     }

//     let html = `
//         <table class="data-table">
//             <thead><tr><th>学号/工号</th><th>姓名</th>${canEditClass ? '<th>操作</th>' : ''}</tr></thead>
//             <tbody>
//     `
//     for (let member of list) {
//         html += `
//             <tr>
//                 <td>${member.user_number}</td>
//                 <td>${member.username}</td>
//                 ${canEditClass ? `<td><button class="btn-small btn-smallDel btn-removeMember" data-id="${member.user_number}">移除</button>
//                   <button class="btn-small btn-editMember" data-id="${member.user_number}" data-name="${member.username}">编辑</button>
//                   </td>` : ''}
//             </tr>
//         `
//     }
//     html += '</tbody></table>'
//     memberListContent.innerHTML = html

//     //删除，添加成员
//     const memberOperate = document.getElementById('member-operate')
//     if (memberOperate) {
//         if (canEditClass) {
//             //渲染按钮
//             memberOperate.innerHTML = `
//                 <button id="btn-addMember" class="btn-small">+ 添加学生</button>
//             `
//             //添加成员 绑定事件
//             const addBtn = document.getElementById('btn-addMember')
//             if (addBtn) {
//                 addBtn.addEventListener('click', () => addMemberMenu(currentSelectedClassId))
//             }
//             //删除成员 绑定事件
//             document.querySelectorAll('.btn-removeMember').forEach(btn => {
//                 btn.addEventListener('click', async (e) => {
//                     e.stopPropagation()
//                     const userId = btn.getAttribute('data-id')
//                     const result = confirm(`确认将 ${userId} 移出班级吗？`)
//                     if (result) {
//                         try {
//                             await request('/class/members/remove', {
//                                 method: 'POST',
//                                 body: { user_number: userId }
//                             })
//                             await fetchMemberList(currentSelectedClassId)
//                         } catch (err) {
//                             alert('移除失败：' + err.message)
//                         }
//                     }
//                 })
//             })
//             //编辑成员
//             document.querySelectorAll('.btn-editMember').forEach(btn => {
//                 btn.addEventListener('click', async (e) => {
//                     e.stopPropagation()
//                     const userId = btn.getAttribute('data-id')
//                     const oldName = btn.getAttribute('data-name')
//                     const newName = prompt('请输入新的姓名', oldName)
//                     if (newName && newName.trim() !== oldName) {
//                         try {
//                             await request('/class/members/update', {
//                                 method: 'POST',
//                                 body: { user_number: userId, username: newName.trim() }
//                             })
//                             if (currentMemberPage > 1) {
//                                 currentMemberPage = 1
//                             }
//                             await fetchMemberList(currentSelectedClassId)
//                         } catch (err) {
//                             alert('修改失败：' + err.message)
//                         }
//                     }
//                 })
//             })
//         }
//     } else {
//         memberOperate.innerHTML = ''
//     }
// }
//成员分页
function renderMemberPageBottom(data) {
    const container = document.getElementById('member-pagebottom')
    if (!container) return
    const totalPage = data.totalPage || 1
    let html = ''
    for (let i = 1; i <= totalPage; i++) {
        html += `<button data-page="${i}" class="${i === currentMemberPage ? 'active' : ''}">${i}</button>`
    }
    container.innerHTML = html
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentMemberPage = parseInt(btn.getAttribute('data-page'), 10)
            if (currentSelectedClassId) {
                fetchMemberList(currentSelectedClassId)
            }
        })
    })
}




//menu
//新增班级
function addClassMenu() {
    const modal = new Modal({
        title: '新增班级',
        content: `
     <div class="input-item">
            <label>班级名称</label>
 <input type="text" id="addClassname" placeholder="例如 计算机1班" required>
         </div>
        
    `,
        onConfirm: async () => {
            const addclassname = modal.element.querySelector('#addClassname').value.trim()
            const msg = modal.element.querySelector('.modal-message')
            try {
                await request('/class/add', {
                    method: 'POST',
                    body: { classname: addclassname }
                })
                modal.close()
                currentClassPage = 1
                await fetchClassList()
            } catch (err) {
                showMessage(msg, err.message)
            }
        }
    })
    modal.render()
}
//学生
function addMemberMenu(classId) {
    if (!classId) {
        alert('请先选择一个班级')
        return
    }
    const modal = new Modal({
        title: '添加学生',
        content: `
     <div class="input-item">
            <label>学生学号</label>
            <input type="text" id="student-number" placeholder="例如 STU001" required>
        </div>
    `,
        onConfirm: async () => {
            const student_id = modal.element.querySelector('#student-number').value.trim()
            const msg = modal.element.querySelector('.modal-message')
            try {
                await request('/class/members/add', {
                    method: 'POST',
                    body: { user_number: student_id, class_id: classId }
                })
                modal.close()
                await fetchMemberList(classId)
            } catch (err) {
                showMessage(msg, err.message)
            }
        }
    })
    modal.render()

}
//绑定老师
function bindTeacherMenu(classId) {
    if (!classId) {
        alert('请先选择一个班级')
        return
    }
    //是否已经绑定老师
    const selectedLi = document.querySelector(`#class-listContent li[data-classId="${classId}"]`)
    const teacherSpan = selectedLi?.querySelector('span')?.innerText || ''
    const hasTeacher = teacherSpan.includes('班主任:')
    if (hasTeacher) {
        alert('该班级已绑定班主任，请先解绑后，再绑定新老师')
        return
    }


    const modal = new Modal({
        title: '绑定班主任',
        content: `
     <div class="input-item">
            <label>教师工号</label>
        <input type="text" id="teacher-number" placeholder="例如 TEA001" required>
        </div>
        <div class="message modal-message"></div>
    `,
        onConfirm: async () => {
            const teacher_id = modal.element.querySelector('#teacher-number').value.trim()
            const msg = modal.element.querySelector('.modal-message')
            try {
                await request('/class/bind-teacher', {
                    method: 'POST',
                    body: { user_number: teacher_id, class_id: classId }
                })
                modal.close()
                await fetchClassList()
                if (currentSelectedClassId == classId) {
                    await fetchMemberList(classId)
                }
            } catch (err) {
                msg.innerText = err.message
                msg.className = ('message error')
            }
        }
    })
    modal.render()

}
