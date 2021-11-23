var express = require('express')
var stuUser = require('../models/Stuuser')
var report = require('../models/report')
var fs =require('fs')
const multer = require('multer');
const path = require('path');
var stu = express.Router()
var md5 = require('blueimp-md5')
const alluser = require('../models/user');
const { response } = require('express');
//学生页面
stu.get('/student',function(req,res){
   return res.render('./students/student.html',{
      user: req.session.user
  })
  })
  //公告页面
  stu.get('/student/notice',function(req,res){
    res.render('./students/notice.html',{
      user: req.session.user
  })
  })

//学生设置页面
stu.get('/student/setting',function(req,res){
   res.render('./students/setting.html',{
    user: req.session.user
  })
  
})

stu.post('/student/setting',function(req,res,next){
  //更新数据,new设置为true，data返回更新后的数据，默认为false
  stuUser.findByIdAndUpdate(req.body.id,req.body,{new:true},function(err,data){
    if(err){
       return next(err)
    }
   req.session.user=data
  //成功后查询数据
      res.status(200).json({
        err_code: data.power,
        message: 'OK'
      })
   })
})
//学生头像设置
stu.get('/student/sethead',function(req,res){
  res.render('./students/setHead.html',{
    user: req.session.user
  })
})

  
var upload = multer({dest: '/public/'});
 
stu.post('/student/sethead', upload.any(), function(req, res, next) {
 console.log(req.files[0]); // 上传的文件信息
 
 var des_file = "./public/img/head/" + req.files[0].originalname;
 fs.readFile( req.files[0].path, function (err, data) {
  fs.writeFile(des_file, data, function (err) {
   if( err ){
    console.log( err );
    return next(err)
   }else{
    //  更新数据,new设置为true，data返回更新后的数据，默认为false
  stuUser.findByIdAndUpdate(req.body.id,{
    head: req.files[0].originalname
  },{new:true},function(err,data){
    if(err){
       return next(err)
    }
    req.session.user=data
     res.redirect('/student/setHead')
  })

   }
  });
 });
});

//学生密码修改页面
stu.get('/student/password',function(req,res){
  res.render('./students/password.html',{
    user: req.session.user
  })
})

stu.post('/student/password',function(req,res,next){
      var body =req.body
     var oldpassword = md5(md5(body.password))
     var newpassword = md5(md5(body.newpassword))

      if(oldpassword != req.session.user.password){
        res.status(200).json({
          err_code: 1,
          message: 'OK'
        })
        return true
      }
      //向学生信息表保存更新后的密码
      stuUser.findByIdAndUpdate(body.id,{
        password: newpassword
      },function(err){
        if(err){
          return next(err)
        }
       //成功后再向总体用户表保存
       alluser.findOneAndUpdate({username:body.username},{
         password: newpassword
       },function(err){
        if(err){
          return next(err)
        }

        req.session.user = null
        res.status(200).json({
          err_code: 2,
          message: 'OK'
        })
       })

      })

})



//学生报修页面
stu.get('/student/report',function(req,res){
  res.render('./students/report.html',{
    user: req.session.user
  })
})

stu.post('/student/report',function(req,res,next){
   //保存数据到report集合(表)中
 
   new report(req.body).save(function(err){
    if (err) {
      return next(err)
    }
    // Express 提供了一个响应方法：json
    // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
    res.status(200).json({
      err_code: 2,
      message: 'OK'
    })
   })

})

//学生报修记录页面
stu.get('/student/record',function(req,res,next){
  
  report.find({
    repusername:req.session.user.username,
  },function(err,data){
    if(err){
        return res.status(500).send('server error...')
    }
    res.render('./students/record.html',{
      user: req.session.user,
     reports:data
    })
}).sort({_id:-1})  //-1：倒叙查询，1正序查询


  
})


//学生报修记录页面编辑页面
stu.get('/student/record-edit',function(req,res){
  
  report.findById(req.query.id,function(err,data){
    if(err){
        return res.status(500).send('server error...')
    }
   
    res.render('./students/record-edit.html',{
      user: req.session.user,
      report: data
    })
})

})



stu.post('/student/record-edit',function(req,res,next){
  
  report.findByIdAndUpdate(req.body.id,req.body,{new:true},function(err){
   if(err){
    
       return res.status(500).send('server error...')
   }
   
  res.status(200).json({
    err_code: 2,
    message: 'OK',
    user: req.session.user
  })
 
})
})


//学生报修记录页面删除记录
stu.get('/student/record-delete',function(req,res,next){
report.findByIdAndRemove(req.query.id,function(err){
  if(err){
    return next(err)
  }
  res.redirect('/student/record')
})
})

module.exports = stu