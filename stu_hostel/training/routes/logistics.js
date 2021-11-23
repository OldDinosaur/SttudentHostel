var express = require('express')
var logistics = require('../models/logistics')
var log = express.Router()
var report = require('../models/report')
//后勤人员主页面
log.get('/logistics',function(req,res){
   res.render('./logistics/logistics.html',{
       user:req.session.user
   })
})


//后勤人员设置页面
log.get('/logistics/setting',function(req,res){
  res.render('./logistics/log_setting.html',{
    user:req.session.user
})
})


log.post('/logistics/setting',function(req,res,next){
  //更新数据,new设置为true，data返回更新后的数据，默认为false
  logistics.findByIdAndUpdate(req.body.id,req.body,{new:true},function(err,data){
    if(err){
       return next(err)
    }
   req.session.user=data
  //成功后查询数据
      res.status(200).json({
        err_code: 2,
        message: 'OK'
      })
   })
})


//后勤人员负责宿舍的全部报修单
log.get('/logistics/record',function(req,res,next){
  if(req.query && req.query.option == '表单号' && req.query.conment != ''){
     report.find({
       repnum:req.query.conment
     },function(err,data){
       if(err){
           return res.status(500).send('server error...')
       }
       res.render('./logistics/record.html',{
         user: req.session.user,
         reports:data
       })
 
   }).sort({_id:-1})
   return true
   }if(req.query && req.query.option == '宿舍号' && req.query.conment != ''){
    report.find({
      repdormitory:req.session.user.dorm,
      repdorm:req.query.conment
    },function(err,data){
      if(err){
          return res.status(500).send('server error...')
      }
      res.render('./logistics/record.html',{
        user: req.session.user,
        reports:data
      })

  }).sort({_id:-1})
  return true
  }else{
  //查询
      report.find({
        repdormitory:req.session.user.dorm,
      },function(err,data){
        if(err){
            return res.status(500).send('server error...')
        }
        res.render('./logistics/record.html',{
          user: req.session.user,
        reports:data
        })

      }).sort({_id:-1})  //-1：倒叙查询，1正序查询
      
   }
      

  })





  log.post('/logistics/record',function(req,res,next){
   //更新维修状态
    report.findByIdAndUpdate(req.body.id,{repstate:req.body.repstate},{new:true},function(err,data){
      if(err){
       
          return res.status(500).send('server error...')
      }
     
     res.status(200).json({
       err_code: 2,
       message: 'OK',
       user: req.session.user,
       reports:data
     })
    
   })
  })





module.exports = log