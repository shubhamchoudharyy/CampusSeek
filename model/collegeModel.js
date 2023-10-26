const mongoose=require('mongoose');


const CollegeSchema=new mongoose.Schema({
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
    phone:{
        type:Number,
        unique:true,
    },
   
    photoUrl:{
        type:String,
        default:null,
    },
    website:{
        type:String,
        default:null,
    },
    location:{
        type:String,
    },
    district:{
        type:String,
    },
    state:{
        type:String,
    },
    country:{
        type:String,
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        default:"pending"
    },
    ratings:[
        {
            userId:{
                type:String,
            },
            rate:{
                type:Number,
            },
            review:{
                type:String
            },
            name:{
                type:String
            }
        }
    ],
    rating:{
        type:mongoose.Types.Decimal128,
        default:0,
    },
   
   
    courses:[
        {
            
            course:{
                type:String,
            },
            short:{
                type:String,
            },
            file:{
                type:String,
            },
        }
    ],
    follow:[
        {
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

    ],
    view:[
        {
            userId:{
                type:String,
            },
            name:{
                type:String,
            },
            phone:{
                type:Number,
            },
            email:{
                type:String,
            },
            photoUrl:{
                type:String,
            },
        }
    ]

},{timestamps:true})

const collegeModel=mongoose.model('colleges',CollegeSchema);

module.exports=collegeModel;