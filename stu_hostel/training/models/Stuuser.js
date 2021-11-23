var mongoose = require('mongoose')

//连接数据库，没有数据库会自动创建
mongoose.connect('mongodb://localhost/dorm', { useMongoClient: true })

var Schema = mongoose.Schema

var StuuserSchema = new Schema({
    username:{               //账号
        type: String,        //类型
        require: true        //必须有
    },
    //密码
    password:{          
        type: String,
        require : true
    },
    //权限
    power:{
        type: Number,
        enum: [0, 1, 2],//0后勤，1舍管，2学生
        default: 2 
    },
    name:{
        type:String,
        default: ''
    },
    sex:{
        type: Number,
        enum: [-1, 0, 1], //-1保密，0男，1女
        default: -1
    },
    //宿舍楼
    dormitory:{
        type:String,
        default:''
    },  
    //宿舍号
    dorm:{
        type: String,
        default: ''
    },
    //电话
    phone:{
        type:String,
        default: ''
    },
    //头像
    head:{
        type:String,
        default:'avatar-max-img.png'
    },
    //创建时间
    created_time:{
        type: Date,
        // 注意：这里不要写 Date.now() 因为会即刻调用
       // 这里直接给了一个方法：Date.now
      // 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
        default:Date.now    //默认值
    }
})

module.exports = mongoose.model('Stuuser', StuuserSchema)