//登录注册的js

//获取表单元素
const loginForm = document.getElementById('login-form')
const registerForm = document.getElementById('register-form')
//切换选项卡-->按钮少-->遍历绑定事件
const btnTabs = document.querySelectorAll('.btn-tab')
const forms = document.querySelectorAll('.form')
btnTabs.forEach(btn => {
    //绑定事件
    btn.addEventListener('click', () => {
        //一点击，就遍历两个按钮两个表单，去掉active
        btnTabs.forEach(b => b.classList.remove('active'))
        forms.forEach(f => f.classList.remove('active'))

        //点击的这个tab加上active
        btn.classList.add('active')

        //对应的form加上active
        //根据data-tab获取对应
        const tabId = btn.getAttribute('data-tab')
        if (tabId === 'tab-login') {
            loginForm.classList.add('active')

        } else {
            registerForm.classList.add('active')
        }
        document.getElementById('login-message').innerHTML = ''
        document.getElementById('register-message').innerHTML = ''
    })
})

//注册
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    //检测输入-->获取内容（要和后端对应）
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const msg = document.getElementById('register-message');

    if (password.length < 6 || password.length > 20) {
        showMessage(msg, '密码长度应为6-20位', true)
        return
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]{3,20}$/.test(username)) {
        showMessage(msg, '用户名格式：3-20位，字母/数字/下划线/中文', true)
        return
    }
    if (!username || !password || !role) {
        showMessage(msg, '请填写所有字段', true)
        return
    }

    //注册请求
    try {
        const response = await fetch(`${API_Address}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        })
        const results = await response.json()
        if (results.status === 0) {
            const studentNumber = results.data?.user_number || '未知';
            alert(`注册成功！\n您的学号是：${studentNumber}\n请妥善保管，登录时需要输入。`)
            //清空表单
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
            //自动跳转
            setTimeout(() => {
                //模拟鼠标点击
                document.querySelector('.btn-tab[data-tab="tab-login"]').click()
            }, 1500)
        } else {
            showMessage(msg, results.message || '注册失败', true)
        }

    } catch (err) {
        showMessage(msg, '网络错误，请检查后端服务', true)
        console.error(err)
    }

})
//登录
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = document.getElementById('login-username').value.trim()
    const user_number = document.getElementById('login-user_number').value.trim()
    const password = document.getElementById('login-password').value
    const msg = document.getElementById('login-message')

    if (!username || !user_number || !password) {
        showMessage(msg, '请填写完整信息')
        return
    }

    try {
        //请求登录
        const response = await fetch(`${API_Address}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, user_number, password })
        })
        const results = await response.json()
        //成功
        if (results.status === 0) {
            localStorage.setItem('token', results.data.token)
            localStorage.setItem('user', JSON.stringify(results.data.user))

            showMessage(msg, '登陆成功，正在跳转...', false)
            setTimeout(() => {
                window.location.href = 'dashboard.html'
            }, 1000)
        } else {
            //失败
            showMessage(msg, results.message || '登录失败')
        }
    } catch (err) {
        showMessage(msg, '网络错误，请检查后端服务', true)
        console.error(err)
    }
})