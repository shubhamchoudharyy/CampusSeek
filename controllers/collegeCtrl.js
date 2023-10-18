const userModel=require('../model/userModel');
const collegeModel=require('../model/collegeModel');
const postModel=require('../model/postsModel');
const multer = require('multer');
const path = require('path');
const fs=require('fs');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, getStorage } = require('firebase/storage');
const firebase=require('../firebase')

// Initialize Firebase Admin SDK with your service account credentials


const { ref, uploadBytesResumable } = require('firebase/storage');


const getCollegeInfoController=async(req,res)=>{
    try{
        const userId=req.body.userId;
        const user=await userModel.findOne({_id:userId});
        if(!user){
            res.status(400).send({success:false,message:'User not found'})
        }
        const college=await collegeModel.findOne({userId:user._id})
        if(!college){
            res.status(400).send({success:false,message:'User not found'});
        }

        res.status(200).send({success:true,message:'User data fetch success',data:college})

    }catch(error){
        console.error(error);
        res.status(500).send({success:false,message:'Something went wrong'})
    }
}

const getInfoController=async(req,res)=>{
  try{
    const userId=req.params.userId;
    const user=await userModel.findById(userId);
    if(!user){
        res.status(400).send({success:false,message:'User not found'})
    }
    const college=await collegeModel.findOne({userId:userId})
    if(!college){
        res.status(400).send({success:false,message:'User not found'});
    }

    res.status(200).send({success:true,message:'User data fetch success',data:college})

}catch(error){
    console.error(error);
    res.status(500).send({success:false,message:'Something went wrong'})
}
  
}

const getPendingInfoController=async(req,res)=>{
  try{
    
    const college=await collegeModel.findOne({_id:req.params.userId})
    if(!college){
        res.status(400).send({success:false,message:'User not found'});
    }

    res.status(200).send({success:true,message:'User data fetch success',data:college})

}catch(error){
    console.error(error);
    res.status(500).send({success:false,message:'Something went wrong'})
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
  
      res.status(200).json({ success: true, college: updatedCollege });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: 'Failed to add courses' });
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
      res.status(500).json({ success: false, message: 'Something went wrong while unfollowing the college' });
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
  console.log(req.body);
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
  console.log(req.body);
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
  console.log(req.body);
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
  console.log(req.body);
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
    // console.log(userId);
    // const user = await userModel.findOne({ _id: userId });

    // // console.log('User Data:', user);
    // if(!user){
    //   return res.status(400).json({success:false,message:'User not found'})
    // }

    // Find posts where userId matches user.follow.collegeId or user._id
    const posts = await postModel.find({userId:userId }).sort({ createdAt: -1 });

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

// const getPosteController = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     console.log(userId);
//     // const user = await userModel.findOne({ _id: userId });

//     // // console.log('User Data:', user);
//     // if(!user){
//     //   return res.status(400).json({success:false,message:'User not found'})
//     // }

//     // Find posts where userId matches user.follow.collegeId or user._id
//     const posts = await postModel.find({userId:userId }).sort({ createdAt: -1 });

//     console.log('Posts:', posts);

//     if (!posts) {
//       return res.status(400).json({ success: false, message: 'No posts' });
//     }
//     return res.status(200).json({ success: true, message: 'Posts received', data: posts });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error.' });
//   }
// };

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
const getDeletePostController = async (req, res) => {
  console.log(req.body)
  try {
    const posts = req.body.postId;
    console.log(posts)

    const post = await postModel.findOne({ _id: posts });

    if (!post) {
      return res.status(400).json({ success: false, message: 'No posts' });
    }

    // Await the deletion of the post
    await post.deleteOne();

    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


module.exports={getCollegeInfoController,postController,getPendingInfoController,getInfoController
  ,addCoursesController,getDeletePostController,
  uploadFile,getPostsController,rateController,videoController,descriptionController,removeCourseController,updateController,getPostController}