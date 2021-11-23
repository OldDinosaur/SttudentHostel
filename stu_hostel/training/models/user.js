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
    }
})

module.exports = mongoose.model('user', StuuserSchema)