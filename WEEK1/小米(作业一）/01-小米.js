
const phoneData = [
    {
        img: "xiaomiIma/phone-02.webp",
        title: "REDMI Turbo 5 MAX",
        desc: "天机 9500s | 9000mAh 最大小米电池 | 1.5k 超级阳光屏",
        price: {
            current: "2199元起",
            original: "2499元"
        }
    },
    {
        img: "xiaomiIma/phone-03.webp",
        title: "REDMI Turbo 5",
        desc: "天玑 8500-Ultra | 6.59\" 黄金尺寸 | 1.5K 超级阳光屏",
        price: {
            current: "1999元起",
            original: "2299元"
        }
    },
    {
        img: "xiaomiIma/phone-04.webp",
        title: "Xiaomi 17 Ultra 徕卡版",
        desc: "全方位徕卡相机体验｜徕卡2亿像素光学变焦",
        price: {
            current: "7999元起",
            original: ""
        }
    },
    {
        img: "xiaomiIma/phone-05.webp",
        title: "Xiaomi 17 Ultra",
        desc: "徕卡2亿像素光学变焦｜徕卡1英寸光影大师",
        price: {
            current: "6999元起",
            original: ""
        }
    },
    {
        img: "xiaomiIma/phone-06.webp",
        title: "REDMI K90 Pro Max",
        desc: "第五代 骁龙®8至尊版｜超级像素护眼屏｜5X 潜望长焦",
        price: {
            current: "3999元起",
            original: ""
        }
    },
    {
        img: "xiaomiIma/phone-07.webp",
        title: "REDMI K90",
        desc: "骁龙®8至尊版 ｜Sound by Bose 联合调音",
        price: {
            current: "2599元起",
            original: ""
        }
    },
    {
        img: "xiaomiIma/phone-08.webp",
        title: "Xiaomi 17 Pro Max",
        desc: "徕卡光影大师 移动影像系统｜徕卡 5X 超聚光潜望长焦",
        price: {
            current: "5999元起",
            original: ""
        }
    },
    {
        img: "xiaomiIma/phone-09.webp",
        title: "Xiaomi 17 Pro",
        desc: "徕卡光影大师 移动影像系统 ｜徕卡 5X 浮动潜望长焦｜妙享背屏",
        price: {
            current: "4999元起",
            original: ""
        }
    }
];


const footerData = [
    {
        title: "选购指南",
        children: [
            "手机",
            "电视",
            "笔记本",
            "平板",
            "穿戴",
            "耳机",
            "家电",
            "路由器",
            "音箱",
            "配件"
        ]
    },
    {
        title: "服务中心",
        children: [
            "申请售后",
            "售后政策",
            "服务价格",
            "订单查询",
            "以旧换新",
            "保障服务",
            "防伪查询",
            "F码通道"
        ]
    },
    {
        title: "线下门店",
        children: [
            "小米之家",
            "服务网点",
            "授权体验店/专区"
        ]
    },
    {
        title: "关于小米",
        children: [
            "了解小米",
            "加入小米",
            "投资者关系",
            "ESG与可持续发展",
            "廉洁举报"
        ]
    },
    {
        title: "关注我们",
        children: [
            "新浪微博",
            "官方微信",
            "联系我们",
            "公益基金会",
            "小米高校合作"
        ]
    }
];
const earphoneData = [
    {
        img: "xiaomiIma/air-02.webp",
        title: "REDMI Buds 8 活力版",
        desc: "声享澎湃音质，电量超长相随",
        price: {
            current: "119元",
            original: ""
        }
    },
    {
        img: "xiaomiIma/air-03.webp",
        title: "REDMI Buds 8 青春版",
        desc: "42dB深度主动降噪 | 12.4mm超大镀钛动圈",
        price: {
            current: "139元",
            original: ""
        }
    },
    {
        img: "xiaomiIma/air-04.webp",
        title: "REDMI Buds 8 Pro",
        desc: "55dB深度降噪 | 新增智能查找 | 同档无敌",
        price: {
            current: "399元",
            original: ""
        }
    },
    {
        img: "xiaomiIma/air-05.webp",
        title: "Xiaomi Buds 6",
        desc: "仿生曲线设计，哈曼金耳朵联合调音",
        price: {
            current: "699元",
            original: ""
        }
    },
    {
        img: "xiaomiIma/air-06.webp",
        title: "Redmi Buds 6",
        desc: "42dB深度主动降噪 | 双麦AI通话抗风噪",
        price: {
            current: "189元",
            original: ""
        }
    },
    {
        img: "xiaomiIma/air-07.webp",
        title: "Xiaomi 开放式耳机 Pro",
        desc: "人体工学设计，三点支撑，贴合不压耳",
        price: {
            current: "949元起",
            original: "999元"
        }
    },
    {
        img: "xiaomiIma/air-08.webp",
        title: "Xiaomi Buds 5 Pro",
        desc: "小米首发双功放三单元 | 55dB深度降噪",
        price: {
            current: "1099元起",
            original: "1299元"
        }
    }
];


const ul = document.querySelector('.box-bd ul')
for (let i = 0; i < phoneData.length; i++) {
    const li = document.createElement('li')
    li.innerHTML = `
     <a href="#" target="_blank">
                        <img src="${phoneData[i].img}" alt="手机">
                        <h3>${phoneData[i].title}</h3>
                        <p class="desc">${phoneData[i].desc}</p>
                        <p class="price">
                            <span>${phoneData[i].price.current}</span><span>${phoneData[i].price.original}</span>
                        </p>
                    </a>
    `
    ul.appendChild(li)
}

// const air = document.querySelector('.box-bd .air')
// for (let i = 0; i < earphoneData.length; i++) {
//     const li = document.createElement('li')
//     li.innerHTML = `
//      <a href="#" target="_blank">
//                         <img src="${earphoneData[i].img}" alt="手机">
//                         <h3>${earphoneData[i].title}</h3>
//                         <p class="desc">${earphoneData[i].desc}</p>
//                         <p class="price">
//                             <span>${earphoneData[i].price.current}</span><span>${earphoneData[i].price.original}</span>
//                         </p>
//                     </a>
//     `
//     air.appendChild(li)
// }


const footerBottom = document.querySelector('.footerBottom')
for (let i = 0; i < footerData.length; i++) {
    const dlList = document.createElement('dl')
    dlList.innerHTML = `
        <dt>${footerData[i].title}</dt>
    `
    for (let j = 0; j < footerData[i].children.length; j++) {
        const dd = document.createElement('dd')
        dd.innerHTML = `
            <a href="#">${footerData[i].children[j]}</a>
        `
        dlList.appendChild(dd)
    }
    footerBottom.appendChild(dlList)
}

const search = document.querySelector('.search')
document.addEventListener('click', function (e) {
    if (e.target.tagName === 'INPUT') {
        search.children[1].style.display = "block"
        search.children[1].style.border = "1px solid #ff6900"
        search.children[1].style.borderTop = "none"
    }
    else {
        search.children[1].style.display = "none"
    }
})


// 循环添加item
const XiaomiData = [
    { img: "xiaomiIma/xiaomi-01.webp", name: "Xiaomi 17 Ultra 徕卡版", price: "7999元起" },
    { img: "xiaomiIma/xiaomi-02.webp", name: "Xiaomi 17 Ultra", price: "6999元起" },
    { img: "xiaomiIma/xiaomi-03.webp", name: "Xiaomi 17 Pro Max", price: "5999元起" },
    { img: "xiaomiIma/xiaomi-04.webp", name: "Xiaomi 17 Pro", price: "4999元起" },
    { img: "xiaomiIma/xiaomi-05.webp", name: "Xiaomi 17", price: "4299元起" },
    { img: "xiaomiIma/xiaomi-06.webp", name: "Xiaomi MIX Flip 2", price: "4999元起" }
]
const redmiData = [
    {
        img: "xiaomiIma/phone-02.webp",
        name: "REDMI Turbo 5 MAX",
        price: "2199元起"
    },
    {
        img: "xiaomiIma/phone-03.webp",
        name: "REDMI Turbo 5",
        price: "1999元起"
    },
    {
        img: "xiaomiIma/phone-04.webp",
        name: "REDMI K90 Pro Max",
        price: "3999元起"
    },
    {
        img: "xiaomiIma/phone-05.webp",
        name: "REDMI K90",
        price: "2599元起"
    },
    {
        img: "xiaomiIma/phone-06.webp",
        name: "REDMI Note 15 Pro+",
        price: "1799元起"
    },
    {
        img: "xiaomiIma/phone-07.webp",
        name: "REDMI Note 15 Pro",
        price: "1349元起"
    }
];
const tvData = [
    {
        img: "xiaomiIma/dianshi-01.webp",
        name: "小米电视S Pro Mini LED 2026",
        price: "6499元起"
    },
    {
        img: "xiaomiIma/dianshi-02.webp",
        name: "旗舰系列-S Mini LED 2025",
        price: "3799元起"
    },
    {
        img: "xiaomiIma/dianshi-03.webp",
        name: "REDMI 电视 X 2026",
        price: "2999元起"
    },
    {
        img: "xiaomiIma/dianshi-04.webp",
        name: "旗舰系列-S Pro Mini LED",
        price: "4999元起"
    },
    {
        img: "xiaomiIma/dianshi-05.webp",
        name: "性价比爆款-REDMI A Pro",
        price: "1699元起"
    },
    {
        img: "xiaomiIma/dianshi-06.webp",
        name: "性价比爆款-REDMI A 2025",
        price: "799元起"
    }
];
const notebookData = [
    { img: "xiaomiIma/bijiben-01.webp", name: "Xiaomi Book Pro 14", price: "7999元起" },
    { img: "xiaomiIma/bijiben-02.webp", name: "REDMI Book 14 锐龙版 2025", price: "3499元起" },
    { img: "xiaomiIma/bijiben-03.webp", name: "REDMI Book Pro 16 2025", price: "6199元起" },
    { img: "xiaomiIma/bijiben-04.webp", name: "REDMI Book Pro 14 2025", price: "5899元起" },
    { img: "xiaomiIma/bijiben-05.webp", name: "REDMI Book 14 2025", price: "3399元起" },
    { img: "xiaomiIma/bijiben-06.webp", name: "REDMI Book 16 2025", price: "4399元起" }
];

const padData = [
    { img: "xiaomiIma/pad-01.webp", name: "REDMI Pad 2 Pro", price: "1799元起" },
    { img: "xiaomiIma/pad-02.webp", name: "Xiaomi Pad 8 Pro", price: "2899元起" },
    { img: "xiaomiIma/pad-03.webp", name: "Xiaomi Pad 8", price: "2299元起" },
    { img: "xiaomiIma/pad-04.webp", name: "REDMI Pad 2", price: "1199元起" },
    { img: "xiaomiIma/pad-05.webp", name: "REDMI K Pad", price: "2699元起" },
    { img: "xiaomiIma/pad-06.webp", name: "Xiaomi Pad 7S Pro 12.5", price: "3099元起" }
];

const applianceData = [
    { img: "xiaomiIma/jiadian-01.webp", name: "米家冰箱 对开636L", price: "1899元" },
    { img: "xiaomiIma/jiadian-02.webp", name: "巨省电Pro立式3匹超一级能效米家空调", price: "5499元" },
    { img: "xiaomiIma/jiadian-03.webp", name: "小米空调1.5匹新1级能效", price: "1899元" },
    { img: "xiaomiIma/jiadian-04.webp", name: "米家三区洗衣机Pro滚筒10kg", price: "4699元" },
    { img: "xiaomiIma/jiadian-05.webp", name: "米家洗衣机洗烘12kg", price: "1799元" },
    { img: "xiaomiIma/jiadian-06.webp", name: "米家冰箱Pro微冰鲜双系统十字平嵌560L冰晶白", price: "6699元" }
];

const routerData = [
    { img: "xiaomiIma/luyouqi-01.webp", name: "Xiaomi路由器AX3000T", price: "129元" },
    { img: "xiaomiIma/luyouqi-02.webp", name: "Xiaomi全屋路由 BE3600Pro 套装", price: "699元" },
    { img: "xiaomiIma/luyouqi-03.webp", name: "Xiaomi路由器 BE3600", price: "159元" },
    { img: "xiaomiIma/luyouqi-04.webp", name: "Xiaomi路由器 BE6500 Pro", price: "549元" },
    { img: "xiaomiIma/luyouqi-05.webp", name: "Xiaomi路由器 BE5000", price: "279元" },
    { img: "xiaomiIma/luyouqi-05.webp", name: "查看全部", price: "" }
];
// 渲染盒子
const header = document.querySelector('.header')
const smallSlider = document.createElement('div')

smallSlider.innerHTML = `
        <ul class="w1226">
                     </ul>
    `
smallSlider.classList.add('smallSlider')
header.appendChild(smallSlider)
const sliderUl = smallSlider.querySelector('ul')
// 渲染盒子内商品 函数封装
function goods(data) {
    sliderUl.innerHTML = ''
    for (let j = 0; j < data.length; j++) {
        const itemli = document.createElement('li')
        itemli.innerHTML = `
                    <a href="#">
                        <img src="${data[j].img}" alt="">
                        <p class="desc">${data[j].name}</p>
                        <p class="price"> ${data[j].price}</p>
                    </a>
         `
        sliderUl.appendChild(itemli)
    }

}
// 鼠标移入渲染相应商品
const droplist = document.querySelector('.droplist')
droplist.addEventListener('mouseover', function (e) {

    if (e.target.tagName === 'A') {
        const id = e.target.dataset.id
        if (id === '0') {
            goods(XiaomiData);
        } else if (id === '1') {
            goods(redmiData);
        } else if (id === '2') {
            goods(tvData);
        } else if (id === '3') {
            goods(notebookData);
        } else if (id === '4') {
            goods(padData);
        } else if (id === '5') {
            goods(applianceData);
        } else if (id === '6') {
            goods(routerData);
        } else {
            // 未知id，隐藏滑块
            smallSlider.classList.remove('show');
            return;
        }
        smallSlider.classList.add('show')
    }
})
smallSlider.addEventListener('mouseover', function () {
    smallSlider.classList.add('show')
})
smallSlider.addEventListener('mouseout', function () {
    smallSlider.classList.remove('show')
})
droplist.addEventListener('mouseout', function () {
    smallSlider.classList.remove('show')
})

// 轮播图
const sliderData = [
    { img: "xiaomiIma/slider-01.webp" },
    { img: "xiaomiIma/slider-02.webp" },
    { img: "xiaomiIma/slider-03.webp" },
    { img: "xiaomiIma/slider-04.webp" },
    { img: "xiaomiIma/slider-05.webp" },
    { img: "xiaomiIma/slider-06.webp" }
];
const navsliderImg = document.querySelector('.navslider img')
const next = document.querySelector('.next')
const prev = document.querySelector('.prev')
const mindoll = document.querySelector('.mindoll')
let i = 0
// 打开页面，自动轮播
let timerID = setInterval(function () {
    next.click()
}, 1000)
// 右侧按钮
next.addEventListener('click', function () {
    i++
    i = i >= sliderData.length ? 0 : i
    sliderbtn()

})
// 左侧按钮
prev.addEventListener('click', function () {
    i--
    i = i < 0 ? sliderData.length - 1 : i
    sliderbtn()


})
// 鼠标经过，停止轮播
navsliderImg.parentNode.addEventListener('mouseenter', function () {
    clearInterval(timerID)
})
// 鼠标离开，继续轮播
navsliderImg.parentNode.addEventListener('mouseleave', function () {
    clearInterval(timerID)
    timerID = setInterval(function () {
        next.click()
    }, 2000)
})
// 组装成函数轮播
function sliderbtn() {
    navsliderImg.src = sliderData[i].img
    document.querySelector('.mindoll .active').classList.remove('active')
    document.querySelector(`.mindoll li:nth-child(${i + 1}) a`).classList.add('active')

}

const phoneTypeData = [
    { img: "xiaomiIma/typePhone-01.webp", name: "Xiaomi 数字旗舰" },
    { img: "xiaomiIma/typePhone-01.webp", name: "REDMI 数字系列" },
    { img: "xiaomiIma/typePhone-01.webp", name: "Xiaomi MIX系列" },
    { img: "xiaomiIma/typePhone-01.webp", name: "Xiaomi Civi系列" },
    { img: "xiaomiIma/typePhone-05.webp", name: "REDMI K系列" },
    { img: "xiaomiIma/typePhone-06.webp", name: "REDMI Turbo系列" },
    { img: "xiaomiIma/typePhone-01.webp", name: "REDMI Note系列" }
];
// 电视类型数组
const tvTypeData = [
    { img: "xiaomiIma/tvType-01.webp", name: "小米电视SPro MiniLED2..." },
    { img: "xiaomiIma/tvType-01.webp", name: "旗舰系列-S Mini LED 2025" },
    { img: "xiaomiIma/tvType-01.webp", name: "旗舰系列-S Pro Mini LED" },
    { img: "xiaomiIma/tvType-01.webp", name: "巨幕影院-REDMI MAX" },
    { img: "xiaomiIma/tvType-01.webp", name: "游戏高刷-REDMI 电视 X ..." },
    { img: "xiaomiIma/tvType-01.webp", name: "性价比爆款-REDMI A Pro" },
    { img: "xiaomiIma/tvType-01.webp", name: "性价比爆款-REDMI A 2025" }
];

// 健康出行/配件类数组（提取所有项目）
const healthTypeData = [
    { img: "xiaomiIma/healthType-01.webp", name: "洗手机" },
    { img: "xiaomiIma/healthType-01.webp", name: "体脂秤" },
    { img: "xiaomiIma/healthType-01.webp", name: "儿童滑板车" },
    { img: "xiaomiIma/healthType-01.webp", name: "修剪器" },
    { img: "xiaomiIma/healthType-01.webp", name: "米家跑步机" },
    { img: "xiaomiIma/healthType-01.webp", name: "婴儿推车" },
    { img: "xiaomiIma/healthType-01.webp", name: "剃须刀" },
    { img: "xiaomiIma/healthType-01.webp", name: "米家动感单车" },
    { img: "xiaomiIma/healthType-01.webp", name: "理发器" },
    { img: "xiaomiIma/healthType-01.webp", name: "牙刷" },
    { img: "xiaomiIma/healthType-01.webp", name: "走步机" },
    { img: "xiaomiIma/healthType-01.webp", name: "吹风机" },
    { img: "xiaomiIma/healthType-01.webp", name: "益智积木" },
    { img: "xiaomiIma/healthType-01.webp", name: "体重秤" },
    { img: "xiaomiIma/healthType-01.webp", name: "儿童手表" }
];
// 家电数据
const applianceTypeData = [
    { img: "xiaomiIma/appliance-01.webp", name: "壁挂空调" },
    { img: "xiaomiIma/appliance-01.webp", name: "除湿机" },
    { img: "xiaomiIma/appliance-01.webp", name: "洗碗机" },
    { img: "xiaomiIma/appliance-01.webp", name: "电磁炉" },
    { img: "xiaomiIma/appliance-01.webp", name: "立式空调" },
    { img: "xiaomiIma/appliance-01.webp", name: "洗地机" },
    { img: "xiaomiIma/appliance-01.webp", name: "扫地机器人" },
    { img: "xiaomiIma/appliance-01.webp", name: "水壶" },
    { img: "xiaomiIma/appliance-01.webp", name: "中央空调Pro" },
    { img: "xiaomiIma/appliance-01.webp", name: "电暖器" },
    { img: "xiaomiIma/appliance-01.webp", name: "吸尘器" },
    { img: "xiaomiIma/appliance-01.webp", name: "落地风扇" },
    { img: "xiaomiIma/appliance-01.webp", name: "冰箱" },
    { img: "xiaomiIma/appliance-01.webp", name: "净水器" },
    { img: "xiaomiIma/appliance-01.webp", name: "加湿器" },
    { img: "xiaomiIma/appliance-01.webp", name: "投影仪" },
    { img: "xiaomiIma/appliance-01.webp", name: "滚筒洗衣机" },
    { img: "xiaomiIma/appliance-01.webp", name: "微蒸烤" },
    { img: "xiaomiIma/appliance-01.webp", name: "空气净化器" },
    { img: "xiaomiIma/appliance-01.webp", name: "灯具" },
    { img: "xiaomiIma/appliance-01.webp", name: "波轮洗衣机" },
    { img: "xiaomiIma/appliance-01.webp", name: "烟灶" },
    { img: "xiaomiIma/appliance-01.webp", name: "电饭煲" },
    { img: "xiaomiIma/appliance-01.webp", name: "除螨仪" }
];

// 笔记本平板显示器数据
const notebookPadMonitorTypeData = [
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Book Pro 14" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Pad 7S Pro" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Book Pro 16" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI 显示器A27U" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Pad 2 Pro" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Pad 7 Ultra" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI 平板" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "显示器A27U Type-C版2026" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Pad 8 Pro" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Pad 7 Pro" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi 平板" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Pad 8" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "Xiaomi Pad 7" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Book 14 2025" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Pad 2" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Book 14 锐龙版" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Book 16 2025" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI K Pad" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "REDMI Book Pro 14" },
    { img: "xiaomiIma/notebookPadMonitor-01.webp", name: "办公娱乐显示器" }
];

// 出行穿戴数据
const wearableTypeData = [
    { img: "xiaomiIma/wearable-01.webp", name: "Xiaomi Watch S5" },
    { img: "xiaomiIma/wearable-01.webp", name: "XiaomiWatchS441mm" },
    { img: "xiaomiIma/wearable-01.webp", name: "小米车载充电器快充版1A..." },
    { img: "xiaomiIma/wearable-01.webp", name: "XiaomiWatch5" },
    { img: "xiaomiIma/wearable-01.webp", name: "XiaomiWatchS4" },
    { img: "xiaomiIma/wearable-01.webp", name: "REDMIWatch6" },
    { img: "xiaomiIma/wearable-01.webp", name: "REDMIWatch5" },
    { img: "xiaomiIma/wearable-01.webp", name: "小米AI眼镜" },
    { img: "xiaomiIma/wearable-01.webp", name: "小米手环9Pro" },
    { img: "xiaomiIma/wearable-01.webp", name: "小米手环10" },
    { img: "xiaomiIma/wearable-01.webp", name: "XiaomiWatchS4Sport" },
    { img: "xiaomiIma/wearable-01.webp", name: "小米手环10NFC版" },
    { img: "xiaomiIma/wearable-01.webp", name: "REDMI手环3" }
]

// 耳机音箱数据
const audioTypeData = [
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds8活力版" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi开放式耳机Pro" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMIBuds6活力版" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi智能音箱Pro" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds8青春版" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi Buds5" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi蓝牙音箱Mini" },
    { img: "xiaomiIma/audio-01.webp", name: "小爱音箱Play增强版" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds8Pro" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds6Pro" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi智能音箱" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi智能家庭屏Mini" },
    { img: "xiaomiIma/audio-01.webp", name: "XiaomiBuds6" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds6" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi智能家庭屏Pro8" },
    { img: "xiaomiIma/audio-01.webp", name: "XiaomiSound Pro" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi骨传导耳机2" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds7S" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi智能家庭屏6" },
    { img: "xiaomiIma/audio-01.webp", name: "小米小爱音箱Play" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi Buds5Pro" },
    { img: "xiaomiIma/audio-01.webp", name: "REDMI Buds6青春版" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi智能家庭屏10" },
    { img: "xiaomiIma/audio-01.webp", name: "Xiaomi Sound 2 Max" }
];

// 健康儿童数据
const healthChildTypeData = [
    { img: "xiaomiIma/healthChild-01.webp", name: "洗手机" },
    { img: "xiaomiIma/healthChild-01.webp", name: "体脂秤" },
    { img: "xiaomiIma/healthChild-01.webp", name: "儿童滑板车" },
    { img: "xiaomiIma/healthChild-01.webp", name: "修剪器" },
    { img: "xiaomiIma/healthChild-01.webp", name: "米家跑步机" },
    { img: "xiaomiIma/healthChild-01.webp", name: "婴儿推车" },
    { img: "xiaomiIma/healthChild-01.webp", name: "剃须刀" },
    { img: "xiaomiIma/healthChild-01.webp", name: "米家动感单车" },
    { img: "xiaomiIma/healthChild-01.webp", name: "理发器" },
    { img: "xiaomiIma/healthChild-01.webp", name: "牙刷" },
    { img: "xiaomiIma/healthChild-01.webp", name: "走步机" },
    { img: "xiaomiIma/healthChild-01.webp", name: "吹风机" },
    { img: "xiaomiIma/healthChild-01.webp", name: "益智积木" },
    { img: "xiaomiIma/healthChild-01.webp", name: "体重秤" },
    { img: "xiaomiIma/healthChild-01.webp", name: "儿童手表" }

]
// 生活箱包数据
const lifestyleTypeData = [
    { img: "xiaomiIma/lifestyle-01.webp", name: "小背包" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "服饰" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "驱蚊器" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "双肩包" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "眼镜" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "毛巾/浴巾" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "胸包" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "床垫" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "笔" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "旅行箱" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "枕头" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "收纳袋" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "螺丝刀" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "运动鞋" },
    { img: "xiaomiIma/lifestyle-01.webp", name: "水杯" }
];

// 智能路由器数据
const routerTypeData = [
    { img: "xiaomiIma/router-01.webp", name: "MIJIA K歌麦克风" },
    { img: "xiaomiIma/router-01.webp", name: "摄像机" },
    { img: "xiaomiIma/router-01.webp", name: "打印机" },
    { img: "xiaomiIma/router-01.webp", name: "智能门锁" },
    { img: "xiaomiIma/router-01.webp", name: "小米路由器" },
    { img: "xiaomiIma/router-01.webp", name: "门铃/猫眼" },
    { img: "xiaomiIma/router-01.webp", name: "REDMI路由器" },
    { img: "xiaomiIma/router-01.webp", name: "小爱音箱" },
    { img: "xiaomiIma/router-01.webp", name: "智能家庭" },
    { img: "xiaomiIma/router-01.webp", name: "家庭屏" },
    { img: "xiaomiIma/router-01.webp", name: "对讲机" }
];

// 电源配件数据
const powerAccessoryTypeData = [
    { img: "xiaomiIma/powerAccessory-01.webp", name: "插座插排" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "电池" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "移动电源" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "自拍杆" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "数据线" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "手机壳" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "穿戴配件" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "手机贴膜" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "平板配件" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "无线充电器" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "充电器" },
    { img: "xiaomiIma/powerAccessory-01.webp", name: "其他配件" }
];
// 渲染盒子
const navslider = document.querySelector('.navslider')
const tab = document.createElement('div')
tab.innerHTML = `<ul></ul>`
tab.classList.add('tab')
navslider.appendChild(tab)
const tabul = document.querySelector('.tab ul')
// 渲染type商品函数
function typeTab(data) {

    tabul.innerHTML = ''
    for (let j = 0; j < data.length; j++) {
        const li = document.createElement('li')
        li.innerHTML = `
    <a href="#"><img src="${data[j].img}" alt="">${data[j].name}</a>
    `
        tabul.appendChild(li)
    }
}
// 鼠标经过，执行渲染函数
const navType = document.querySelector('.navType')
navType.addEventListener('mouseover', function (e) {
    if (e.target.tagName === 'A') {
        let id = e.target.dataset.typeid
        if (id === '0') {
            typeTab(phoneTypeData);
        } else if (id === '1') {
            typeTab(tvTypeData);                 // 电视
        } else if (id === '2') {
            typeTab(applianceTypeData);          // 家电
        } else if (id === '3') {
            typeTab(notebookPadMonitorTypeData); // 笔记本平板显示器
        } else if (id === '4') {
            typeTab(wearableTypeData);           // 出行穿戴
        } else if (id === '5') {
            typeTab(audioTypeData);              // 耳机音箱
        } else if (id === '6') {
            typeTab(healthChildTypeData);        // 健康儿童
        } else if (id === '7') {
            typeTab(lifestyleTypeData);          // 生活箱包
        } else if (id === '8') {
            typeTab(routerTypeData);             // 智能路由器
        } else if (id === '9') {
            typeTab(powerAccessoryTypeData);     // 电源配件
        } else {
            tab.classList.remove('typeShow');
            return;
        }
        tab.classList.add('typeShow');

    }
})
navType.addEventListener('mouseout', function () {
    tab.classList.remove('typeShow')
})
