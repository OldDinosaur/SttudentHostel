var express = require('express')
var stuUser = require('../models/Stuuser')
var User = require('../models/user')
var logistics = require('../models/logistics')

var md5 = require('blueimp-md5')

var home = express.Router()

//主页路由
home.get('/',function(req,res){
    res.render('index.html',{
        user: req.session.user
    })
})

//登录页面路由
home.get('/login',function(req,res){
    res.render('login.html')
})

home.post('/login',function(req,res,next){
    // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body
  //判断输入用户名密码是否为空
  if(body.username ==='' || body.password===''){
    return res.status(200).json({ 
      err_code: 3,
      message: 'username and password is null!!!.'
    })
  }


  //从总体用户数据库表中查询
  User.findOne({
    username: body.username,
    password: md5(md5(body.password))
  }, function (err, User) {
    if (err) {
      // return res.status(500).json({
      //   err_code: 500,
      //   message: err.message
      // })
      return next(err)
    }
    
    // 如果用户名和密码匹配，则 stuUser 是查询到的用户对象，否则就是 null
    if (!User) {
      return res.status(200).json({
        err_code: 5,
        message: 'usernaem or password is invalid.'
      })
    }
     //用户存在，判断用户权限
        if(User.power === 2){                //学生
            stuUser.findOne({
              username: body.username,
              password: md5(md5(body.password))
            },function(err,studata){
                if (err) {
                  return next(err)
                }
                
                // 如果用户名和密码匹配，则 stuUser 是查询到的用户对象，否则就是 null
                if (!studata) {
                  return res.status(200).json({
                    err_code: 5,
                    message: 'usernaem or password is invalid.'
                  })
                }
                    // 用户存在，登陆成功，通过 Session 记录登陆状态
              req.session.user = studata

              res.status(200).json({
                err_code: studata.power,
                message: 'OK'
              })
            })
        }

         //用户存在，判断用户权限
         else if(User.power === 0){                //后勤人员
          logistics.findOne({
            username: body.username,
            password: md5(md5(body.password))
          },function(err,data){
              if (err) {
                return next(err)
              }
              
              // 如果用户名和密码匹配，则 stuUser 是查询到的用户对象，否则就是 null
              if (!data) {
                return res.status(200).json({
                  err_code: 5,
                  message: 'usernaem or password is invalid.'
                })
              }
                  // 用户存在，登陆成功，通过 Session 记录登陆状态
            req.session.user = data

            res.status(200).json({
              err_code: data.power,
              message: 'OK'
            })
          })
      }else{
        console.log('登录错误')
      }
       


  })
})


//注册页面路由
home.get('/register',function(req,res,next){
    res.render('register.html')
})
home.post('/register',function(req,res,next){
    // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  var body = req.body
  //用户名正则，4到16位（字母，数字，下划线，减号）
  var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
  if (uPattern.test(body.username)) {
    //查询判断总体用户表
    User.findOne({
      username: body.username
      }, function (err, data) {
          if (err) {
            // return res.status(500).json({
            //   success: false,
            //   message: '服务端错误'
            // })
            return next(err)
          }
          // console.log(data)
          if (data) {
            // 用户名已存在
            return res.status(200).json({ 
              err_code: 1,
              message: 'username aleady exists.'
            })
          }

          // 对密码进行 md5 重复加密
          body.password = md5(md5(body.password))
          //向总体用户表中保存账号密码信息
          new User(body).save(function(err,data){
              if (err) {
                return next(err)
              }
                //在总体用户表保存成功后再向学生用户表中保存账号密码信息
              new stuUser(body).save(function (err, stuUser) {
                if (err) {
                  return next(err)
                }
            
              //   注册成功，使用 Session 记录用户的登陆状态
                req.session.user = stuUser

                // Express 提供了一个响应方法：json
                // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
                res.status(200).json({
                  err_code: stuUser.power,
                  message: 'OK'
                })
                // 服务端重定向只针对同步请求才有效，异步请求无效
                // res.redirect('/')
              })
          })
          
        })
  }else{
    return res.status(200).json({ 
      err_code: 3,
      message: 'username Nonstandard!!!.'
    })
  }

 
})

//退出登录
home.get('/logout',function(req,res){
 // 清除登陆状态
 req.session.user = null

 // 重定向到网站主页
 res.redirect('/')
})

//axios测试
home.get('/axios',function(req,res){
  res.render('test/Axios.html')
})
home.post('/axios',function(req,res){
  // res.header("Access-Control-Allow-Origin", '*'); // 设置允许来自哪里的跨域请求访问（值为*代表允许任何跨域请求，但是没有安全保证）
  //   res.header("Access-Control-Allow-Headers", "*"); // 设置请求头中允许携带的参数
   const data ={
     name:'二大爷'
   }
   res.send(JSON.stringify(data))
   
})
//jsonp原理测试
home.all('/jsonp',(req,res) =>{
// res.send(`console.log('hello')`)

const data ={
  name:'二大爷'
}
res.end('console.log('+JSON.stringify(data)+')')

})


module.exports = home