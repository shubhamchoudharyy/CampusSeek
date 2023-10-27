const mongoose=require('mongoose');

const PostSchema=new mongoose.Schema({
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
    date:{
        type:Date,
        default:Date.now()
    },
    color:{
        type:String,
    },
    style:{
        type:String,
        default:null,
    },
    video:{
        type:String,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    }
},{timestamps:true})

const postModel=mongoose.model('posts',PostSchema);

module.exports=postModel;