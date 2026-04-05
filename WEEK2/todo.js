const todoContent = document.querySelector('.content')
const footer = document.querySelector('.footer')
const slogan = document.querySelector('.slogan')
const alert = document.querySelector('.alert')
//提交框和搜索框
const inputList = document.querySelector('.inputList')
const todoInput = document.querySelector('.inputList input')
const searchList = document.querySelector('.searchList')
const searchInput = document.querySelector('.searchList input')
const subSear = document.querySelector(".searchList .subSear")
const subSears = document.querySelectorAll(".subSear")
// 开关
const close = document.querySelector('.close')
const open = document.querySelector('.open')
const all = document.querySelector('.all')
const wasDone = document.querySelector('.wasDone')
const clearDone = document.querySelector('.clearDone')
const clearAll = document.querySelector('.clearAll')
const importer = document.querySelector('.importer')
const menuOpen = document.querySelector('.menu-open')
const menuClose = document.querySelector('.menu-close')
//弹窗
const modal = document.querySelector('.modal')
const alertTitle = document.querySelector('.alertTitle')
const alertContent = document.querySelector('.alertContent')
const btnConfirm = document.querySelector('.btn-confirm')
const btnCancel = document.querySelector('.btn-cancel')

//刷新
let todoList = []
//默认页面-->防止不同页面之间的按键会出bug（都委托给todoContent了）
let page = 'all'
//语言（默认中文）
const en = document.querySelector('.language span:nth-child(2)')
const zh = document.querySelector('.language span:nth-child(4)')
const langPack = {
    zh: {
        //作者
        author: "作者",
        // 输入
        placeholderAdd: "新增待办事项...",
        placeholderSearch: "您想搜索...",
        submitBtn: "提交",
        searchBtn: "搜索",
        backBtn: "返回",
        // 空白提示
        alertEmpty: "💡请输入内容！",
        // 默认首页
        emptyTip: "添加你的第一个待办事项！📝",
        howToUse: "食用方法💡：",
        guide1: "✔️ 拖拽Todo上下移动可排序(仅支持PC) 支持Enter提交",
        guide2: "✔️ 双击Todo可编辑",
        guide3: "✔️ 右侧小窗口是快捷操作",
        localTip: "🔒 所有数据存储在浏览器本地",
        importTip: "📝 支持下载和导入",
        // 回收站
        trashEmpty: "回收站内暂无事项！🗑️",
        //搜索
        searchEmpty: "暂无匹配的搜索结果 🗝️",
        // 底部
        footerText: "剩余%d项未完成",
        footerSearchText: "搜索到%d项",
        // 菜单
        close: "关",
        shortcut: "快捷操作",
        open: "开✨",
        all: "全部",
        trashText: "回收站",
        markAllDone: "全部标为已完成",
        clearDone: "清除已完成",
        clearAll: "清除全部",
        exportText: "导出(txt/json)",
        importText: "导入(txt/json)",
        //弹窗
        cancel: "取消",
        confirm: "确定",
        confirmPlease: "请确认",
        //弹窗text
        confirmAll: "确认一键勾选完成全部待办事项？",
        confirmClearAll: "确认清除全部待办事项?",
        confirmClearDone: "确认清除全部已完成的代办事项?",
        confirmPermant: "确定永久删除？",
        //绿色块 
        allFinishBtn: "全部标为完成"
    },
    en: {
        author: "author",

        placeholderAdd: "Add a new todo...",
        placeholderSearch: "Search...",
        submitBtn: "Submit",
        searchBtn: "Search",
        backBtn: "Back",

        alertEmpty: "💡Please enter content!",

        emptyTip: "Add your first todo! 📝",
        howToUse: "How to use💡:",
        guide1: "✔️ Drag to sort (PC only) Enter to submit",
        guide2: "✔️ Double-click to edit todo",
        guide3: "✔️ Right menu is shortcuts",
        localTip: "🔒 All data stored locally",
        importTip: "📝 Support export & import",

        trashEmpty: "Trash is empty! 🗑️",

        searchEmpty: "Search is empty 🗝️",

        footerText: "items remainning %d ...",
        footerSearchText: "%d result(s)",


        close: "Close",
        shortcut: "Shortcuts",
        open: "Open✨",
        all: "All",
        trashText: "Trash",
        markAllDone: "Mark All Done",
        clearDone: "Clear Completed",
        clearAll: "Clear All",
        exportText: "Export(txt/json)",
        importText: "Import(txt/json)",

        cancel: "cancel",
        confirm: "confirm",
        confirmPlease: "Please Confirm",

        confirmAll: "Confirm to mark all todos as completed?",
        confirmClearAll: "Confirm to clear all todos?",
        confirmClearDone: "Confirm to clear all completed todos?",
        confirmPermant: "Confirm permanent deletion?",

        allFinishBtn: "Mark All Completed"
    }
};
let currentLang = localStorage.getItem('lang')
currentLang = !currentLang ? "zh" : currentLang
let t = langPack[currentLang]
// 切换语言函数
function changeLanguage() {
    t = langPack[currentLang]
    //下面是html写好的
    //作者
    document.querySelector(".author").textContent = t.author;

    //输入
    todoInput.placeholder = t.placeholderAdd
    searchInput.placeholder = t.placeholderSearch;
    document.querySelector(".inputList button").textContent = t.submitBtn;
    document.querySelector(".searchList button").textContent = t.searchBtn;
    subSear.textContent = t.backBtn;

    //空白提示
    document.querySelector(".alert").textContent = t.alertEmpty;

    //全部标为完成
    document.querySelector(".allFinish").textContent = t.allFinishBtn;

    //快捷方式开关
    document.querySelector(".close").textContent = t.close
    document.querySelector(".open").textContent = t.open
    document.querySelector(".shortcut").textContent = t.shortcut
    document.querySelector(".importer").textContent = t.importText
    //弹窗
    document.querySelector(".btn-confirm").textContent = t.confirm
    document.querySelector(".btn-cancel").textContent = t.cancel
    //这里是渲染的
    if (page === 'all') {
        renderContent();
    } else if (page === 'trash') {
        trashboxRender();
    }
    toggleTrashbox();
}
//语言事件监听
en.addEventListener('click', function () {
    currentLang = "en"
    localStorage.setItem('lang', currentLang)
    en.classList.add('active')
    zh.classList.remove('active')
    changeLanguage()
})
zh.addEventListener('click', function () {
    currentLang = "zh"
    localStorage.setItem('lang', currentLang)
    zh.classList.add('active')
    en.classList.remove('active')
    changeLanguage()
})

//搜索内容函数
function searchTodo(keyword) {
    let list = []
    if (page === 'all') {
        list = todoList.filter(item => !item.deleted)
    } else if (page === 'trash') {
        list = todoList.filter(item => item.deleted)
    }
    let result = list.filter(item => item.content.toLowerCase().includes(keyword))
    renderSearch(result)
}
//搜索结果渲染
function renderSearch(result) {
    todoContent.innerHTML = ''
    const searchCount = result.length
    if (searchCount === 0) {
        todoContent.innerHTML = ` <div class="tip">${t.searchEmpty}</div>`
        footer.innerHTML = ''
        return
    }
    let todoItem = result.map(item => {
        const done = item.completed ? 'done' : ''
        const finishDone = item.completed ? 'finishDone' : ''
        if (page === 'all') {
            return `
        <div class="todo-item ${done}">
                 <div class="btn-finish ${finishDone}" data-id="${item.id}"></div>
               <div class="item-content" data-id="${item.id}" contenteditable="false">${item.content}</div>                   
              <div class="btn-del" data-id="${item.id}"><img src="xinxiIma/del.svg" alt=""></div>
                </div>
         `
        }
        else if (page === 'trash') {
            return `
        <div class="todo-item ${done}">
                    <div class="btn-del1" data-id="${item.id}"><img src="xinxiIma/del.svg" alt=""></div>
               <div class="item-content" data-id="${item.id}" contenteditable="false">${item.content}</div>                   
                    <div class="btn-recover" data-id="${item.id}"><img src="xinxiIma/恢复.svg" alt=""></div>
                </div>
        `
        }
    }).join('')
    todoContent.innerHTML = todoItem
    footer.innerHTML = t.footerSearchText.replace('%d', searchCount)

}
// 提交搜索空格检查
function checkblank(find) {
    if (find.children[0].value.trim() === '') {
        find.classList.remove('marginBottom')
        alert.classList.add('marginBottom')
        alert.style.display = "block"
        return false
    }
    else {
        find.classList.add('marginBottom')
        alert.classList.remove('marginBottom')
        alert.style.display = "none"
        return true
    }
}
//提交 搜索绑定事件
inputList.addEventListener('click', function (e) {
    let button = e.target.closest('button')
    if (!button) return
    if (checkblank(inputList)) {
        addItem()
    }
})
inputList.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (checkblank(inputList)) {
            addItem()
        }
    }
})

searchList.addEventListener('click', function (e) {
    let button = e.target.closest('button')
    if (!button) return
    if (checkblank(searchList)) {
        let keyword = searchInput.value.toLowerCase()
        searchTodo(keyword)

    }
})
searchList.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (checkblank(searchList)) {
            let keyword = searchInput.value.toLowerCase()
            searchTodo(keyword)

        }
    }
})
//切换搜索和提交
inputList.addEventListener('click', function (e) {
    let find = e.target.closest('.subSear')
    if (!find) return
    if (page != 'all') {
        e.preventDefault()
        return
    }
    inputList.style.display = 'none'
    searchList.style.display = 'flex'
})
searchList.addEventListener('click', function (e) {
    let find = e.target.closest('.subSear')
    if (!find) return
    if (page != 'all') {
        e.preventDefault()
        return
    }
    inputList.style.display = 'flex'
    searchList.style.display = 'none'
})







//添加item：表单数据存入js数组对象-->全部重新渲染盒子
// 删除item：每个数据有id-->（隐藏）数组对象（方便后续恢复）-->全部重新渲染
//添加item
function addItem() {
    let newObj = {
        id: Date.now(),//等号右边可以直接写表达式
        content: todoInput.value,
        deleted: false,
        completed: false
    }
    todoList.push(newObj)
    //保存数据
    localStorage.setItem('todoList', JSON.stringify(todoList))
    //渲染盒子
    renderContent()
    todoInput.value = ''
}

//all页面渲染
function renderContent() {
    page = 'all'
    const realCount = todoList.filter(item => !item.deleted).length
    const undoneCount = todoList.filter(item => !item.deleted && !item.completed).length
    todoContent.innerHTML = ''
    if (realCount <= 0) {
        todoContent.innerHTML = `
             <div class="tip">${t.emptyTip}</div>
             <div class="method">${t.howToUse}</div>
            <ul>
                <li>${t.guide1}</li>
                <li>${t.guide2}</li>
                <li>${t.guide3}</li>
            </ul>
            <div class="note">${t.localTip}</div>
            <div class="note">${t.importTip}</div>
        `
        footer.innerHTML = '' // 清空底部计数
        return
    }
    let normalList = todoList.filter(ele => ele.deleted === false)
    let todoItem = normalList.map(item => {
        const done = item.completed ? 'done' : ''
        const finishDone = item.completed ? 'finishDone' : ''
        return `
        <div class="todo-item ${done}">
                 <div class="btn-finish ${finishDone}" data-id="${item.id}"></div>
               <div class="item-content" data-id="${item.id}" contenteditable="false">${item.content}</div>                   
              <div class="btn-del" data-id="${item.id}"><img src="xinxiIma/del.svg" alt=""></div>
                </div>
         `
    }).join('')
    todoContent.innerHTML = todoItem
    footer.innerHTML = t.footerText.replace('%d', undoneCount)
    allFinishbtn()
}
//回收站页面渲染
function trashboxRender() {
    page = 'trash'
    todoContent.innerHTML = ''
    footer.innerHTML = ''
    inputList.style.display = 'none'
    searchList.style.display = 'flex'

    let trashList = todoList.filter(item => item.deleted === true)
    if (trashList.length === 0) {
        todoContent.innerHTML = `
        <div class="tip">${t.trashEmpty}</div>

        `
        return
    }
    let trashItem = trashList.map(item => {
        const done = item.completed ? 'done' : ''
        const finishDone = item.completed ? 'finishDone' : ''
        return `
        <div class="todo-item ${done}">
                    <div class="btn-del1" data-id="${item.id}"><img src="xinxiIma/del.svg" alt=""></div>
               <div class="item-content" data-id="${item.id}" contenteditable="false">${item.content}</div>                   
                    <div class="btn-recover" data-id="${item.id}"><img src="xinxiIma/恢复.svg" alt=""></div>
                </div>
        `
    }).join('')
    todoContent.innerHTML = trashItem
}
//todoContent事件委托统一处理 全部
todoContent.addEventListener('click', function (e) {
    if (page === 'all') {
        //删除-->多个按钮，用const btnDel = document.querySelector('.btn-del')
        //只能获取一个，又不想全部按钮都要添加监听
        //-->事件委托（todoContent是唯一的，所以委托给他！）
        let delfind = e.target.closest('.btn-del')
        if (delfind) {
            let delid = delfind.dataset.id
            delItem(delid)
            return
        }
        //完成
        let finfind = e.target.closest('.btn-finish')
        if (finfind) {
            let finid = finfind.dataset.id
            finItem(finid)
            return
        }
    }

    if (page === 'trash') {
        //永久删除
        let del1find = e.target.closest('.btn-del1')
        if (del1find) {
            let del1id = del1find.dataset.id
            manmadeAlert(t.confirmPermant, function () {
                permantDel(del1id)
            })
            return
        }

        //恢复
        let recoverfind = e.target.closest('.btn-recover')
        if (recoverfind) {
            let recoverid = recoverfind.dataset.id
            recoverItem(recoverid)
            return
        }
    }
})

//删除
function delItem(id) {
    todoList.find(item => item.id == id).deleted = true
    //对应存储也要修改
    localStorage.setItem('todoList', JSON.stringify(todoList))
    //重新渲染
    renderContent()
    toggleTrashbox()
}
//完成事项打勾
function finItem(id) {
    const temp = todoList.find(item => item.id == id)
    temp.completed = !temp.completed//实现toggle效果
    //保存
    localStorage.setItem('todoList', JSON.stringify(todoList))
    //渲染
    renderContent()
}


// //编辑功能
todoContent.addEventListener('dblclick', function (e) {
    const iCfind = e.target.closest('.item-content')
    const id = iCfind.dataset.id
    //编辑
    iCfind.contentEditable = true
    iCfind.focus()
    // 回车保存
    iCfind.onkeydown = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault() // 
            iCfind.contentEditable = false
            iCfind.onkeydown = null //
            //更新数据
            todoList.find(item => item.id == id).content = iCfind.innerText
            localStorage.setItem('todoList', JSON.stringify(todoList))
        }
    }
})
slogan.addEventListener('dblclick', function () {
    slogan.contentEditable = true
    slogan.focus()
    slogan.onkeydown = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault() // 
            slogan.contentEditable = false
            slogan.onkeydown = null //
        }
    }

})
//永久性删除
function permantDel(id) {
    todoList = todoList.filter(item => item.id != id)
    localStorage.setItem('todoList', JSON.stringify(todoList))
    trashboxRender()
    toggleTrashbox()
}
//恢复
function recoverItem(id) {
    todoList.find(item => item.id == id).deleted = false
    localStorage.setItem('todoList', JSON.stringify(todoList))
    trashboxRender()
    toggleTrashbox()
}

//回收站快捷方式也要变化
function toggleTrashbox() {
    const oldTrash = menuOpen.querySelector('.trashbox')
    if (oldTrash) {
        oldTrash.remove()
    }
    //判断是否有已删除事项
    const checkdel = todoList.some(item => item.deleted === true)
    if (checkdel) {
        const div = document.createElement('div')
        div.innerHTML = `
     <div class="item trashbox">${t.trashText} </div>   
    `
        menuOpen.insertBefore(div, menuOpen.children[2])
    } else {
        return
    }
}
//点那个全选绿色块
const allFinish = document.querySelector('.allFinish')
allFinish.addEventListener('click', () => {
    manmadeAlert(t.confirmAll, function () {
        allSelected()
    })
})
//点击切换开关
menuClose.addEventListener('click', function (e) {
    const find = e.target.closest('.close')
    if (!find) return
    menuClose.style.display = 'none'
    menuOpen.style.display = 'block'
    if (todoList.length > 0) {
        menuOpen.innerHTML = `
       <div class="item open">${t.open}</div>
    <div class="item all">${t.all}</div>
    <div class="item wasDone">${t.markAllDone}</div>
    <div class="item clearDone">${t.clearDone}</div>   
    <div class="item clearAll">${t.clearAll}</div>
    <div class="item exporter">${t.exportText}</div>
    <div class="item importer">${t.importText}</div>
        `
        toggleTrashbox()
    }
})

menuOpen.addEventListener('click', function (e) {
    const find = e.target.closest('.open')
    if (!find) return
    menuOpen.style.display = 'none'
    menuClose.style.display = 'block'

})
//点快捷方式
menuOpen.addEventListener('click', function (e) {
    if (e.target.classList.contains('wasDone')) {
        allSelected()
    }
})
//点击全部
menuOpen.addEventListener('click', function (e) {
    if (e.target.classList.contains('all')) {
        renderContent()
    }
})
//点击回收站
menuOpen.addEventListener('click', function (e) {
    if (e.target.classList.contains('trashbox')) {
        trashboxRender()
    }
})
//点清除已完成
menuOpen.addEventListener('click', function (e) {
    if (e.target.classList.contains('clearDone')) {
        manmadeAlert(t.confirmClearDone, function () {
            clearSelected()
        })
    }
})
//点清除全部
menuOpen.addEventListener('click', function (e) {
    if (e.target.classList.contains('clearAll')) {
        manmadeAlert(t.confirmClearAll, function () {
            removeAll()

        })
    }
})
//点导出
menuOpen.addEventListener('click', function (e) {
    if (e.target.classList.contains('exporter')) {
        exportTodo()
    }
})
//全选绿色块隐藏与显示
function allFinishbtn() {
    const realCount = todoList.filter(item => !item.deleted).length
    if (realCount >= 1) {
        allFinish.style.display = 'block'
    } else {
        allFinish.style.display = 'none'
    }
}
//全部选中效果
function allSelected() {
    todoList.forEach(item => {
        if (!item.completed) {
            item.completed = true
        }
        localStorage.setItem('todoList', JSON.stringify(todoList))
    })
    renderContent()
}
//清除已完成
function clearSelected() {
    todoList.forEach(item => {
        if (item.completed) {
            item.deleted = true
        }
    })
    localStorage.setItem('todoList', JSON.stringify(todoList))
    renderContent()
    toggleTrashbox()
}

//清除全部
function removeAll() {
    todoList.forEach(item => item.deleted = true)
    localStorage.setItem('todoList', JSON.stringify(todoList))
    renderContent()
    toggleTrashbox()
}


//导出功能

function exportTodo() {
    //把数据拿出来 str
    const data = JSON.stringify(todoList, null, 2)
    //转成二进制数据才能存储
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todoList_${Date.now()}.json`
    a.click()

    URL.revokeObjectURL(url)
    alert('导出成功！')
}
//弹窗
function manmadeAlert(text, dirive) {
    modal.style.display = 'flex'
    alertContent.innerHTML = text
    btnConfirm.onclick = function () {
        modal.style.display = 'none'
        dirive()
    }
    btnCancel.onclick = function () {
        modal.style.display = 'none'
    }
}

//页面加载立即执行
function load() {
    let saved = localStorage.getItem('todoList')//str
    todoList = saved ? JSON.parse(saved) : []
    renderContent()

}
function init() {
    load()
    changeLanguage()
}
document.addEventListener('DOMContentLoaded', init)