var express = require('express')
var path = require('path')
var stu = require('./routes/student')
var logistics = require('./routes/logistics')

var home = require('./routes/home')
var session = require('express-session')

var app = express()
//公开资源目录
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

//express中使用模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))

//post请求
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
  
//挂载登录注册路由
app.use(home)

//挂载学生路由
app.use(stu)
//挂载后勤路由
app.use(logistics)

// 配置一个处理 404 的中间件
app.use(function (req, res) {
    res.render('404.html')
  })
  // 配置一个全局错误处理中间件
  app.use(function (err, req, res, next) {
    
    // res.render('login.html')
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  })
  
//挂载端口
app.listen(3000,function(){
    console.log('server 3000 running...')
})