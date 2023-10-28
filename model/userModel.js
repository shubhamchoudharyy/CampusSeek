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
        // required:true,
        default:null,
        min:8,
    },
    phone:{
        type:Number,
        default:0,
    },
    photoUrl:{
        type:String,
        default:null,
    },

    verified:{
        type:Boolean,
        default:false,
    },

    premium:{
        type:Boolean,
        default:false,
    },
    premiumBuy:{
        type:Date,
    },
    expired:{
        type:Date,
    },
    history:[{
        premiumBuy:{
            type:Date,
        },
        expired:{
            type:Date,
        }
    }],
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
    followers:[
        {
            userId:{
                type:String,
            },
            name:{
                type:String,
    
            },
            email:{
                type:String,
            },
            photoUrl:{
                type:String,
            },
            phone:{
                type:Number,
    
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