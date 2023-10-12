const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    userId:{
        type:String,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50,
    },
    password:{
        type:String,
        required:true,
        min:8,
    },
    phone:{
        type:Number,
    },
    photoUrl:{
        type:String,
        default:null,
    },
    
    isAdmin:{
        type:Boolean,
        default:false,
    },
    isCollege:{
        type:Boolean,
        default:false,
    },
    notification:{
        type:Array,
        default:[]
    },
    seennotification:{
        type:Array,
        default:[]
    },
    rating:[
        {
            collegeId:{
                type:String,
                default:null,
            },
            rate:{
                type:Number,
                default:null,
            },
            review:{
                type:String,
            }
        }
    ],
    follow:[
        {
        collegeId:{
            type:String,
        },
        collegename:{
            type:String,

        },
        collegeLoc:{
            type:String,
        },
        photoUrl:{
            type:String,
        },
        collegeMail:{
            type:String,

        }
    }

    ]

})

const userModel=mongoose.model('users',userSchema);

module.exports=userModel;