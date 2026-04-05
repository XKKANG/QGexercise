//工序库
const libraryBody = document.querySelector('.library-body')
let libraryData = ['原料加工', '粗加工', '精加工', '表面处理', '质量检测', '包装入库']
localStorage.setItem('libraryData', JSON.stringify(libraryData))
//工艺
const listBody = document.querySelector('.list-body')
const btnAdd = document.querySelector('.btn-add')
const btnDel = document.querySelector('.btn-del')
let flowData
//工艺编辑
const panelTitle = document.querySelector('.panel-title')
const panelBody = document.querySelector('.panel-body')
const panelExplain = document.querySelector('.panel-explain')
const btnSave = document.querySelector('.btn-save')
const btnClear = document.querySelector('.btn-clear')
//选中
let selectedFlow = null


//初始化
try {
    flowData = JSON.parse(localStorage.getItem('flowData')) || []
} catch {
    flowData = []
}

//立即执行操作
function init() {
    renderLibrary()
    renderFlow()
}
//函数

//保存local函数
function saveToLocal() {
    localStorage.setItem('flowData', JSON.stringify(flowData))
}
//左侧工序库渲染函数
function renderLibrary() {
    const content = libraryData.map(item => {
        return `
            <li class="library-item" draggable="true">${item}</li>       
        `
    }).join('')
    libraryBody.innerHTML = content
}

//中间工艺列表相关
//渲染工艺列表
function renderFlow() {
    const content = flowData.map((item, index) => {
        return `
        <li class="list-item" data-id="${item.id}">${item.name}${index + 1}</li>
        `
    }).join('')
    listBody.innerHTML = content
}
//新建工艺函数
function addFlow() {

    let id = Date.now()
    const temp = {
        id: id,
        name: `新工艺 `,
        steps: [],
    }
    flowData.push(temp)
    saveToLocal()
    renderFlow()
}

//删除工艺函数
function delFlow(id) {
    flowData = flowData.filter(item => item.id != id)
    selectedFlow = null
    saveToLocal()
    renderFlow()
    renderPanel()
}

//右边panel渲染
function renderPanel() {
    if (!selectedFlow) {
        panelTitle.innerText = `工艺：`
        panelBody.innerHTML = ''
        panelExplain.style.display = 'block'
        return
    }
    panelExplain.style.display = 'none'
    const { name, steps } = selectedFlow
    panelTitle.innerText = `工艺：${name}`
    const content = steps.map((item, index) => {
        return `
         <li class="panel-item" data-id="${item.id}" draggable="true">${index + 1}. ${item.name}<button class="btn-delItem">删除</button></li>
        `
    }).join('')
    panelBody.innerHTML = content
}
//panel添加工序
function addStep(name) {
    if (!selectedFlow) return
    if (!name) return
    selectedFlow.steps.push(
        {
            id: Date.now(),
            name: name
        }
    )
    saveToLocal()
    renderPanel()
}
//panel删除工序
function delStep(id) {
    if (selectedFlow) {
        selectedFlow.steps = selectedFlow.steps.filter(item => item.id != id)
    }
    saveToLocal()
    renderPanel()
}
//清空当前
function clearSteps() {
    if (!selectedFlow) return
    selectedFlow.steps = []
    saveToLocal()
    renderPanel()
}




//事件绑定
//新建工艺
btnAdd.addEventListener('click', addFlow)
//选中工艺
listBody.addEventListener('click', function (e) {
    //添加选中类选择器
    const listItem = e.target.closest('.list-item')
    if (!listItem) return
    document.querySelectorAll('.list-item').forEach(item => item.classList.remove('flowActive'))
    listItem.classList.add('flowActive')
    //取出选中的数据
    const id = listItem.dataset.id
    selectedFlow = flowData.find(item => item.id == id)
    //渲染
    renderPanel()
})
//删除工艺
btnDel.addEventListener('click', () => {
    if (!selectedFlow) {
        alert('请先选择一个工艺！')
        return
    }
    const id = selectedFlow.id
    delFlow(id)
})

//拖拽添加工序
libraryBody.addEventListener('dragstart', function (e) {
    const liItem = e.target.closest('.library-item')
    if (!liItem) return
    const name = liItem.innerText
    e.dataTransfer.setData('name', name)
})
panelBody.addEventListener('dragover', function (e) {
    e.preventDefault()
})

panelBody.addEventListener('drop', function (e) {
    e.preventDefault()
    const name = e.dataTransfer.getData('name')
    addStep(name)
})

//删除相应工序
panelBody.addEventListener('click', function (e) {
    const step = e.target.closest('.btn-delItem')
    if (!step) return
    const li = step.closest('.panel-item')
    const id = li.dataset.id
    delStep(id)
})
//保存
btnSave.addEventListener('click', () => alert('工艺已保存！'))
//清空
btnClear.addEventListener('click', clearSteps)

//编辑区拖拽
let panelItem = null
let placeholder = null
panelBody.addEventListener('dragstart', function (e) {
    panelItem = e.target.closest('.panel-item')
    if (!panelItem) return
    //留位
    panelItem.classList.add('dragging')
    //占位
    placeholder = document.createElement('li')
    placeholder.className = 'placeholder'
})
panelBody.addEventListener('dragover', function (e) {
    e.preventDefault()

    const otherItem = e.target.closest('.panel-item')
    if (!otherItem || panelItem === otherItem) return

    //判断位置（插入上还是下）
    const locate = otherItem.getBoundingClientRect()
    const cal = locate.top + locate.height / 2
    if (e.clientY < cal) {
        panelBody.insertBefore(placeholder, otherItem)
    } else {
        panelBody.insertBefore(placeholder, otherItem.nextElementSibling)
    }
})
panelBody.addEventListener('drop', function (e) {
    e.preventDefault()
    if (!placeholder || !panelItem) return
    placeholder.before(panelItem)
    placeholder.remove()
    panelItem.classList.remove('dragging')
    updatasteps()
    renderPanel()
    panelItem = null
    placeholder = null
})
//数组更新
function updatasteps() {
    if (!selectedFlow) return
    const items = document.querySelectorAll('.panel-item')
    const news = []
    items.forEach(item => {
        const id = item.dataset.id
        const step = selectedFlow.steps.find(item => item.id == id)
        if (step) {
            news.push(step)
        }
    })
    selectedFlow.steps = news
    saveToLocal()
}
init()