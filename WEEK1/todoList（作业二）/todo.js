const todoInput = document.querySelector('.inputList input')
const todoSubmit = document.querySelector('.inputList button')
const todoContent = document.querySelector('.content')
const footer = document.querySelector('.footer')
const alert = document.querySelector('.alert')
let todoCount = 0

// 渲染函数
function addTodo() {
    footer.innerHTML = ''
    if (todoCount === 0) {
        todoContent.innerHTML = ''
    }
    const todoItem = document.createElement('div')
    todoItem.className = 'todo-item'
    todoItem.innerHTML = `
    <div class="btn-finish"></div>
                    <div class="item-content">${todoInput.value}</div>
                    <div class="btn-del"><img src="xinxiIma/del.svg" alt=""></div>
    `
    // 完成todo
    const btnFinish = todoItem.querySelector('.btn-finish')
    btnFinish.addEventListener('click', function () {
        const isDone = todoItem.classList.toggle('done')
        btnFinish.classList.toggle('finishDone')
        if (isDone) {
            todoCount--
        } else {
            todoCount++
        }
        footer.innerHTML = `剩余${todoCount}项未完成`
    })
    // 删除
    const btnDel = todoItem.querySelector('.btn-del')
    btnDel.addEventListener('click', function () {
        todoItem.remove()
        todoCount--
        footer.innerHTML = `剩余${todoCount}项未完成`
        allFinishbtn()
        if (todoCount === 0) {
            todoContent.innerHTML = `
                <div class="tip">添加你的第一个待办事项！📝</div>
                <div class="method">食用方法💡：</div>
                <ul>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)所有提交操作支持Enter回车键提交</li>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)拖拽Todo上下移动可排序(仅支持PC)</li>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)双击上面的标语和Todo可进行编辑</li>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)右侧的小窗口是快捷操作哦</li>
                </ul>
                <div class="note">🔒 所有的Todo数据存储在浏览器本地</div>
                <div class="note">📝 支持下载和导入，导入追加到当前序列</div>
            `
            footer.innerHTML = '' // 清空底部计数
        }
    })

    todoContent.insertBefore(todoItem, todoContent.firstChild)
    todoCount++
    footer.innerHTML = `
    剩余${todoCount}项未完成
    `
    allFinishbtn()
    todoInput.value = ''
}
// 事件监听(点击)
todoSubmit.addEventListener('click', function () {
    if (todoInput.value === '') {
        todoInput.parentNode.classList.remove('marginBottom')
        alert.classList.add('marginBottom')
        alert.style.display = "block"
        return
    }
    else {
        todoInput.parentNode.classList.add('marginBottom')
        alert.classList.remove('marginBottom')
        alert.style.display = "none"
        addTodo()
    }
})
// 回车
todoInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (todoInput.value === '') {
            todoInput.parentNode.classList.remove('marginBottom')
            alert.classList.add('marginBottom')
            alert.style.display = "block"
            return
        }
        else {
            todoInput.parentNode.classList.add('marginBottom')
            alert.classList.remove('marginBottom')
            alert.style.display = "none"
            addTodo()
        }
    }
})

// 全选
const allFinish = document.querySelector('.allFinish')
function allFinishbtn() {

    if (todoCount >= 1) {
        allFinish.style.display = 'block'
    } else {
        allFinish.style.display = 'none'
    }
}
function removeAll() {
    const allTodoItems = document.querySelectorAll('.todo-item')
    for (let i = 0; i < allTodoItems.length; i++) {
        allTodoItems[i].classList.add('done')
        const btnFinish = allTodoItems[i].querySelector('.btn-finish');
        btnFinish.classList.add('finishDone');
    }
    footer.innerHTML = '剩余0项未完成'
}
allFinish.addEventListener('click', removeAll)
// 恢复
function recoverAll() {
    const allTodoItems = document.querySelectorAll('.todo-item')
    for (let i = 0; i < allTodoItems.length; i++) {
        allTodoItems[i].classList.remove('done')
        const btnFinish = allTodoItems[i].querySelector('.btn-finish');
        btnFinish.classList.remove('finishDone');
    }
    footer.innerHTML = `
    剩余${todoCount}项未完成
    `
}
// 清除全部
function delAll() {
    const allTodoItems = document.querySelectorAll('.todo-item')
    for (let i = 0; i < allTodoItems.length; i++) {
        allTodoItems[i].remove()
        const btnFinish = allTodoItems[i].querySelector('.btn-finish');
        btnFinish.classList.remove('finishDone');
    }
    footer.innerHTML = ''
    todoContent.innerHTML = `
                <div class="tip">添加你的第一个待办事项！📝</div>
                <div class="method">食用方法💡：</div>
                <ul>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)所有提交操作支持Enter回车键提交</li>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)拖拽Todo上下移动可排序(仅支持PC)</li>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)双击上面的标语和Todo可进行编辑</li>
                    <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)右侧的小窗口是快捷操作哦</li>
                </ul>
                <div class="note">🔒 所有的Todo数据存储在浏览器本地</div>
                <div class="note">📝 支持下载和导入，导入追加到当前序列</div>
            `
    todoCount = 0
}
// 开关
const menuClose = document.querySelector('.menu-close')
const menuOpen = document.querySelector('.menu-open')

menuClose.addEventListener('click', function () {
    menuClose.style.display = 'none'
    menuOpen.style.display = 'block'
})

menuOpen.addEventListener('click', function () {
    menuOpen.style.display = 'none'
    menuClose.style.display = 'block'
})
menuOpen.children[2].addEventListener('click', removeAll)
menuOpen.children[3].addEventListener('click', recoverAll)
menuOpen.children[4].addEventListener('click', delAll)