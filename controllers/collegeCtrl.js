const userModel=require('../model/userModel');
const collegeModel=require('../model/collegeModel');
const postModel=require('../model/postsModel');
const multer = require('multer');
const path = require('path');
const fs=require('fs');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, getStorage } = require('firebase/storage');
const firebase=require('../firebase')
const stripe=require("stripe")(process.env.STRIPE_SECRET_TEST)


// Initialize Firebase Admin SDK with your service account credentials


const { ref, uploadBytesResumable } = require('firebase/storage');


const getCollegeInfoController=async(req,res)=>{
    try{
        const userId=req.body.userId;
        const user=await userModel.findOne({_id:userId});
        if(!user){
          return res.status(400).send({success:false,message:'User not found'})
        }
        const college=await collegeModel.findOne({userId:user._id})
        if(!college){
          return res.status(400).send({success:false,message:'User not found'});
        }

        return res.status(200).send({success:true,message:'User data fetch success',data:college})

    }catch(error){
        console.error(error);
        return res.status(500).send({success:false,message:'Something went wrong'})
    }
}



const getPendingInfoController=async(req,res)=>{
  try{
    
    const college=await collegeModel.findOne({_id:req.params.userId})
    if(!college){
        return res.status(400).send({success:false,message:'User not found'});
    }
    const user=await userModel.findOne({_id:college.userId});
    if(!user){
      return res.status(400).send({success:false,message:'User not found'});
  }
  const premium=user.premium;
  const verified=user.verified;
  const premiumBuy=user.premiumBuy;
  const expired=user.expired;
  const history=user.history;
    return res.status(200).send({success:true,message:'User data fetch success',data:{college,premium,verified,premiumBuy,expired,history}});

}catch(error){
    console.error(error);
    return res.status(500).send({success:false,message:'Something went wrong'})
}
  
}
const addCoursesController = async (req, res) => {
    try {
      const { userId, courses } = req.body;
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(400).send({ success: false, message: 'User not found' });
      }
  
      const college = await collegeModel.findOne({ userId: user._id });
  
      if (!college) {
        return res.status(404).json({ success: false, error: 'College not found' });
      }
  
      // Check if the courses already exist in the college's courses array
      const existingCourses = college.courses.map((course) => course.course);
  
      const newCourses = {
        course:courses.course,
        short:courses.short,
        file:courses.file,
      };
      
      console.log(newCourses)
      if (existingCourses.includes(newCourses.course)) {
        return res.status(400).json({
          success: false,
          message: 'All courses already exist in the college',
        });
      }
      
  
      // Add the new courses to the college's courses array
      // college.courses = { ...college.courses, ...newCourses };
      college.courses.push(newCourses);

  
      // Save the updated college document
      const updatedCollege = await college.save();
  
      return res.status(200).json({ success: true, college: updatedCollege });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, error: 'Failed to add courses' });
    }
  };
  
  const removeCourseController=async(req,res)=>{
    try{
      console.log(req.body)
      const {index,userId}=req.body;
      const college=await collegeModel.findOne({userId:userId});
      if(!college){
        return res.status(400).json({success:false,message:'User not found'})

      }
      if (index === -1) {
        return res.status(400).json({ success: false, message: 'Course not found' });
      }
      college.courses.splice(index,1);

      await college.save();
      return res.status(200).json({success:true,message:'Course removed'})
    }catch (error) {
      console.error('Error unfollowing college:', error);
      return res.status(500).json({ success: false, message: 'Something went wrong while unfollowing the college' });
    }
  }


  


const storage=getStorage(firebase);
// Handle file upload in your controller
const uploadFile = (req, res) => {
  try {
   
     const fileBuffer=req.file.buffer;
    if(!fileBuffer){
      return res.status(400).json({
        success: false,
        message: 'No file data provided in the request.',
      });
    }
    const storageRef = ref(storage, `files/`+req.file.originalname);
      const uploadTask = uploadBytesResumable(storageRef, fileBuffer);

      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        console.log(error)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if(downloadURL){
            return res.status(200).json({success:true,message:'File Uploaded',data:downloadURL})
          }
          console.log('File available at', downloadURL);
        });
      }
      );
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const updateController=async(req,res)=>{
  
  try{
    const userId=req.body.userId;
    const website=req.body.website;
    const description=req.body.description;
    const user=await userModel.findOne({_id:userId});
    if(!user){
      return res.status(400).json({success:false,message:'User not found'});
    }
    const college=await collegeModel.findOne({userId:user._id});
    if(!college){
      return res.status(400).json({success:false,message:'College not found'});
    }
   
      college.website = website;

      college.description = description;
    
    
    await college.save();
    return res.status(200).json({success:true,message:'Updated Successfully'})
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

const postController=async(req,res)=>{
  

  try{
    const post=await postModel({...req.body});
    const image=req.body.image;
    if(!image){
      return res.status(400).json({success:false,message:'Not an image'})
    }
    const userId=req.body.userId;
    const user=await userModel.findOne({_id:userId});
    if(!user){
      return res.status(400).json({success:false,message:'User not found'});
    }
    post.name=user.name;
    post.email=user.email;
    post.photoUrl=user.photoUrl;
    post.image=image;

    await post.save();
    return res.status(200).json({success:true,message:'Post Uploaded successfully'})

  }catch(error){
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' }); 
  }
}

const videoController=async(req,res)=>{
  
  try{
    const post=await postModel({...req.body});
    const userId=req.body.userId;
    const user=await userModel.findOne({_id:userId});
    if(!user){
      return res.status(400).json({success:false,message:'User not found'});
    }
    post.name=user.name;
    post.email=user.email;
    post.photoUrl=user.photoUrl;

    await post.save();
    return res.status(200).json({success:true,message:'Post Uploaded successfully'})

  }catch(error){
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' }); 
  }
}

const descriptionController=async(req,res)=>{

  try{
    const post=await postModel({...req.body});
    const userId=req.body.userId;
    const user=await userModel.findOne({_id:userId});
    if(!user){
      return res.status(400).json({success:false,message:'User not found'});
    }
    post.name=user.name;
    post.email=user.email;
    post.photoUrl=user.photoUrl;

    await post.save();
    return res.status(200).json({success:true,message:'Post Uploaded successfully'})

  }catch(error){
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' }); 
  }
}

const getPostController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findOne({ _id: userId });

    // console.log('User Data:', user);
    if(!user){
      return res.status(400).json({success:false,message:'User not found'})
    }

    // Find posts where userId matches user.follow.collegeId or user._id
    const posts = await postModel.find({
      $or: [
        { userId: user._id }, // Posts by the user
        { userId: { $in: user.follow.map((followedCollege) => followedCollege.collegeId) } }, // Posts by followed colleges
      ],
    }).sort({ createdAt: -1 });

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

const getPostsController = async (req, res) => {
  try {
    const userId = req.params.userId;
    

    // Find posts where userId matches user.follow.collegeId or user._id
    const posts = await postModel.find({userId:userId }).sort({ createdAt: -1 });


    if (!posts) {
      return res.status(400).json({ success: false, message: 'No posts' });
    }
    return res.status(200).json({ success: true, message: 'Posts received', data: posts });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};



const rateController=async(req,res)=>{
  try{
    const collegeId = req.params.userId;
    const userId = req.body.userId;
    const rate = req.body.rating;
    const review=req.body.review;

    const college = await collegeModel.findOne({ userId: collegeId });
    const user = await userModel.findOne({ _id: userId });

    // Check if the user has already rated the college
    const alreadyRated = user.rating.some((collegeRating) => collegeRating.collegeId === collegeId);

    if (alreadyRated) {
      return res.status(400).json({ success: false, message: 'User has already rated this college.' });
    }

    const newRating = {
      collegeId: collegeId,
      rate: rate,
      review:review,
    };
    
    // Add the new rating to the user's ratings
    user.rating.push(newRating);

    // Add the new rating to the college's ratings
    const newRate={
      userId:userId,
      rate:rate,
      review:review,
      name:user.name
    };
    college.ratings.push(newRate);

    // Calculate the new average rating for the college
    const ratingsSum = college.ratings.reduce((total, rating) => total + rating.rate, 0);
    const currRating = ratingsSum / college.ratings.length;

    // Update the college's currRating
    college.rating = currRating;

    await user.save();
    await college.save();

    return res.status(200).json({ success: true, message: 'Rating saved successfully.' });


  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
const ViewController = async (req, res) => {
  try {
    const collegeId = req.params.userId;
    const userId = req.body.userId;

    if (!userId || !collegeId) {
      return res.status(400).json({ success: false, message: 'Invalid user or college ID' });
    }

    // Find the user and college
    const college = await collegeModel.findOne({ userId: collegeId });
    const user = await userModel.findById(userId);

    // Check if both user and college exist
    if (!user || !college) {
      return res.status(400).json({ success: false, message: 'User or college not found' });
    }

    // Check if the user has already been fetched
    const userIndex = college.view.findIndex((user) => user.userId.toString() === userId);
    if (userIndex !== -1) {
      return res.status(200).json({ success: true, message: 'Already fetched' });
    }

    // Prepare user information for the view record
    const userInfo = {
      userId: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      photoUrl: user.photoUrl,
    };

    // Update the college's view record
    college.view.push(userInfo);
    await college.save();

    return res.status(200).json({ success: true, message: 'View record added successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllViewsController=async(req,res)=>{
  
  try{
    const collegeId=req.params.userId;
    const college=await collegeModel.findOne({userId:collegeId});
    if(!college){
      return res.status(400).json({ success: false, message: 'User or college not found' });

    }
    let views=[];
    for (let i = 0; i < college.view.length; i++) {
      // Check if the index is odd
      if (i % 2 === 1) {
        const user = college.view[i];
        views.push({
          userId: user.userId,
          name: user.name,
          phone: user.phone,
          email: user.email,
          photoUrl: user.photoUrl,
        });
      }
    }
    return res.status(200).json({ success: true, message: 'fetched',data:views });


  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const getDeletePostController = async (req, res) => {
  try {
    const posts = req.body.postId;
    const collegeId=req.body.collegeId;
    const user=await userModel.findOne({_id:collegeId});
    console.log(user);
    
    

    const post = await postModel.findOne({ _id: posts });

    if (!post) {
      return res.status(400).json({ success: false, message: 'No posts' });
    }
    const notification=user.notification;
    notification.push({
      type:'Post-deleted',
      message:'Your Post has been deleted',
      onclickPath:'/notification'
    })
    // console.log(user);
    await user.save();
    // Await the deletion of the post
    await post.deleteOne();

    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getOnePostController=async(req,res)=>{
  try{
    const postId=req.params.userId;
    const post=await postModel.findOne({_id:postId});
    if(!post){
      return res.status(400).json({ success: false, message: 'No posts' });
    }
    return res.status(200).send({success:true,message:'Post fetched',data:post});

  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}


const getPaymentController=async(req,res)=>{
  try{
    const product=req.body;
  
  const lineItems=[{
    price_data:{
      currency:"inr",
      product_data:{
        name:product.name
      },
      unit_amount:1500*100,
    },
    quantity:1,
  }]

  const session=await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    line_items:lineItems,
    mode:"payment",
    success_url:`http://localhost:3000/success/${product._id}`,
    cancel_url:"http://localhost:3000/cancel",

  });

   return res.status(200).json({url:session.url,id:session.id})
  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
   
  
}

const successController=async(req,res)=>{
  
  try{
    const userId = req.body.userId;
const user = await userModel.findOne({ _id: userId });
console.log(user)

if (!user) {
  return res.status(400).json({ success: false, message: 'No user found' });
}


const currentTime = new Date();
const expiration = new Date();
expiration.setDate(expiration.getDate() + 30);

// Create copies of the dates to avoid modifying the original 'currentTime' and 'expiration' objects.
const premiumBuy = new Date(currentTime);
const expired = new Date(expiration);

// Update the user document with the new premium purchase and expiration dates.
user.premiumBuy = premiumBuy;
user.expired = expired;
user.premium=true;

// Push the purchase and expiration dates to the user's history.
user.history.push({ premiumBuy:premiumBuy,expired: expired });

// Save the updated user document to the database.
await user.save();

return res.status(200).json({
  success: true,
  message: 'Premium subscription updated successfully',
 
});

  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}


const premiumCheckController=async(req,res)=>{
  try{
    const userId=req.body.userId;
    const user=await userModel.findOne({_id:userId})
    if (!user) {
      return res.status(400).json({ success: false, message: 'No user found' });
    }
    const expired=user.expired;
    const current=new Date();
  
    if(expired < current){
      console.log("In if")
      user.premium=false;
      await user.save();
      return res.status(200).send({success:true,message:"Your premium has expired"});
    }

    return res.status(200).send({success:false,message:"Premium Member"});


  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
module.exports={getCollegeInfoController,postController,getPendingInfoController,getPaymentController,successController,premiumCheckController

  ,addCoursesController,getDeletePostController,ViewController,getAllViewsController,getOnePostController,
  uploadFile,getPostsController,rateController,videoController,descriptionController,removeCourseController,updateController,getPostController}