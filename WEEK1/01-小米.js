
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

const XiaomiData = [
    { img: "xiaomiIma/phone-02.webp", name: "Xiaomi 17 Ultra 徕卡版", price: "7999元起" },
    { img: "xiaomiIma/phone-03.webp", name: "Xiaomi 17 Ultra", price: "6999元起" },
    { img: "xiaomiIma/phone-04.webp", name: "Xiaomi 17 Pro Max", price: "5999元起" },
    { img: "xiaomiIma/phone-05.webp", name: "Xiaomi 17 Pro", price: "4999元起" },
    { img: "xiaomiIma/phone-06.webp", name: "Xiaomi 17", price: "4299元起" },
    { img: "xiaomiIma/phone-07.webp", name: "Xiaomi MIX Flip 2", price: "4999元起" }
]
const smallSliderUl = document.querySelector('.smallSlider ul')
for (let i = 0; i < XiaomiData.length; i++) {
    const smallSliderli = document.createElement('li')
    smallSliderli.innerHTML = `
                    <a href="#">
                        <img src="${XiaomiData[i].img}" alt="">
                        <p class="desc">${XiaomiData[i].name}</p>
                        <p class="price"> ${XiaomiData[i].price}</p>
                    </a>
    `
    smallSliderUl.appendChild(smallSliderli)
}