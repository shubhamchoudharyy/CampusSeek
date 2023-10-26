

const collegeModel=require('../model/collegeModel')
const userModel=require('../model/userModel')
const postModel=require('../model/postsModel');

const getAllUsersController = async (req, res) => {
    try {
      const users = await userModel.find({ isAdmin: false });
      // Filter out users with isAdmin set to true
  
      res.status(200).send({
        success: true,
        message: 'College users data',
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error while fetching college users',
        error,
      });
    }
  };
  
  

const getAllCollegesController=async(req,res)=>{
    try{
        const colleges=await collegeModel.find({})
        res.status(200).send({success:true,message:'Colleges data list',data:colleges})

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while getting doctor data',
            error
        })
    }

}


const changeAccountStatusController=async(req,res)=>{
    try{
        const {collegeId,status}=req.body
        const college=await collegeModel.findByIdAndUpdate(collegeId,{status})
        const user=await userModel.findOne({_id:college.userId})
        const notification=user.notification
        notification.push({
            type:'college-account-request-updated',
            message:`Your College Account Request has  ${status}`,
            onclickPath:'/notification' 
        })
        const isCollege=user? user.isCollege:false;
        
        
        if(!isCollege){
            user.isCollege =status ==='approved' ? true :false;
        }
        else if(isCollege){
            user.isCollege =status ==='reject' ?false :true;
            // college.deleteOne()
            
        }
        await user.save()
        res.status(201).send({message:'Account status updated',
                success:true,data:college,
            })
    }catch(error){
        console.log(error)
        res.status(500).send({success:false,message:'Error in account status',
    error})
    }
}

const deleteAccountController=async(req,res)=>{
  try{
      const {collegeId}=req.body;
      const college=await collegeModel.findById(collegeId)
      const user=await userModel.findOne({_id:college.userId})
      const notification=user.notification
      notification.push({
          type:'college-account-request-updated',
          message:`Your College Account Request has  Deleted`,
          onclickPath:'/notification' 
      })
      const isCollege=user? user.isCollege:false;
      
      
     
      if(isCollege){
        user.isCollege=false;
        
          college.deleteOne()
          const post=await postModel.find({userId:user._id});
          if(post){
            post.delete();
          }
          
      }
      await user.save()
      res.status(201).send({message:'Account status updated',
              success:true,data:college,
          })
  }catch(error){
      console.log(error)
      res.status(500).send({success:false,message:'Error in account status',
  error})
  }
}
const deleteAccountStatusController = async (req, res) => {
    try {
      const userId = req.params.userId;
      // Get requestingUserId from req.body
      console.log(req.body)
      console.log("userId:", userId);
  
  
    
      const user = await userModel.findOne({ _id: userId });
    //   console.log("user:", user);
  
      if (!user) {
        return res.status(400).send({
          success: false,
          message: `User not found ${userId}`,
        });
      }
  
      if (user.isAdmin) {
        return res.status(403).send({
          success: false,
          message: "Admin users cannot be deleted.",
        });
      }
      if(user.isCollege){
        const college=await collegeModel.findOne({userId:user._id});
        if(!college){
          return res.status(200).json({success:false,message:'College Account can not be deleted'})
        }
        await college.deleteOne();
        const post=await postModel.find({userId:user._id});
        if(post){
          await post.delete();
        }
      }
  
      await user.deleteOne();
  
      res.status(201).send({
        success: true,
        message: "Account deleted",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in account deletion",
        error,
      });
    }
  };
  
  const getPostController = async (req, res) => {
    try {
      // Find all posts and sort them by createdAt in descending order
      const posts = await postModel.find({}).sort({ createdAt: -1 });
  
      // console.log('Posts:', posts);
  
      if (!posts) {
        return res.status(400).json({ success: false, message: 'No posts' });
      }
      
      return res.status(200).json({ success: true, message: 'Posts received', data: posts });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  };
   

  const getVerification=async(req,res)=>{
    try{
      const userId=req.params.userId;
      console.log(userId)
      const user=await userModel.findOne({_id:userId});
      if(!user){
        return res.status(400).send({message:'User not found',success:false})
      }
      user.verified ? user.verified=false : user.verified=true;
      await user.save();
      return res.status(200).send({message:'Success',success:true});
    }catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
  const getPremium=async(req,res)=>{
    try{
      const userId=req.params.userId;
      const user=await userModel.findOne({_id:userId});
      if(!user){
        return res.status(400).send({message:'User not found',success:false})
      }
      user.premium ? user.premium=false : user.premium=true;
      await user.save();
      return res.status(200).send({message:'Success',success:true});
    }catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

module.exports={getAllCollegesController,getPostController,getAllUsersController,getVerification,getPremium,
  changeAccountStatusController,deleteAccountController,deleteAccountStatusController}