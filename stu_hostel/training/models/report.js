var mongoose = require('mongoose')

//连接数据库，没有数据库会自动创建
mongoose.connect('mongodb://localhost/dorm', { useMongoClient: true })

var Schema = mongoose.Schema

var StuuserSchema = new Schema({
    repnum:{               //报修单号
        type: String,        //类型
        require: true        //必须有
    },
     //报修人账号
     repusername:{          
        type: String,
        require : true
    },
    //报修人
    repuser:{          
        type: String,
        require : true
    },
       //宿舍楼
       repdormitory:{
        type:String,
        default:''
    },  
    //宿舍号
    repdorm:{
        type: String,
        require : true

    },
    //电话
   repphone:{
        type:String,
        default: ''
    },
    //报修类型
    reptype:{
        type:String,
        default:''
    },
    //报修内容
    repcontent:{
        type:String,
        default:''
    },
    //报修时间
    reptime:{
        type: String,
        // 注意：这里不要写 Date.now() 因为会即刻调用
       // 这里直接给了一个方法：Date.now
      // 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
        default:Date.now   //默认值
    },
    //维修状态
    repstate:{
        type:Number,
        enum: [-1, 0, 1,2], //-1驳回，0审核，1正在，2完成
        default:0
    }
})

module.exports = mongoose.model('report', StuuserSchema)