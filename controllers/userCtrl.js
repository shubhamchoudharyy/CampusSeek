const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const collegeModel = require('../model/collegeModel');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, getStorage } = require('firebase/storage');
const firebase=require('../firebase')
const GoogleAuthProvider=require('firebase/auth')
const nodemailer=require('nodemailer')

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('../major-de7cb-firebase-adminsdk-m7g1l-a08618d106.json'); // Replace with the path to your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://major-de7cb.appspot.com',
});



const { ref, uploadBytesResumable } = require('firebase/storage');
const postModel = require('../model/postsModel');

const loginControllerGoogle=async(req,res)=>{
  try{
    // console.log(req.body);
    const name=req.body.displayName;
    const Email=req.body.email;
    const photo=req.body.photoURL;

    const User=await userModel.findOne({email:Email});
    if(User){
      const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      // console.log(token)
      
      return res.status(200).json({ message: "Login Success", success: true,data:User, token });
      return;
    }

    const newUser=new userModel({name:name, email:Email,photoUrl:photo,verified:true})
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // console.log(token)
    return res.status(200).json({ message: "Login Success", success: true,data:newUser, token });
    return;



  }catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: `Register Controller ${error.message}`,
      });
      return;
    }
}

const registerController = async (req, res) => {
    try {
      const exisitingUser = await userModel.findOne({ email: req.body.email });
      if (exisitingUser) {
        return res
          .status(200)
          .send({ message: "User Already Exist", success: false });
      }
      
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newUser = new userModel(req.body);
      await newUser.save();
      return res.status(200).json({ message: "Mail Sent Successfully", success: true });
    
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: `Register Controller ${error.message}`,
      });
    }
  };
  
  // login callback
  const loginController = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "user not found", success: false });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invlid EMail or Password", success: false });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      return res.status(200).json({ message: "Login Success", success: true, token,user });
      
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
  };


  const forgotPasswordController=async(req,res)=>{
    try{
      const email=req.body.email;
      const user=await userModel.findOne({email:email});
      if(!user){
        return res.status(400).send({message:"No user found",success:false});
      }
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shubhamsur09@gmail.com',
          pass: 'cnpgkkumhduwgqub'
        }
      });
      
      var mailOptions = {
        from: 'shubhamsur09@gmail.com',
        to: user.email,
        subject: 'ResetPassword Link',
        text: `http://localhost:3000/reset-password/${user._id}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return res.status(400).send({message:"Some Error Occured",success:false});
        } else {
          return res.status(200).json({ message: "Mail Sent Successfully", success: true });
        }
      });

    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  }

  const resetPasswordController=async(req,res)=>{
    console.log(req.body)
    try{
      
      const password=req.body.password;
      
      
      const user=await userModel.findOne({_id:req.body.userId});
      console.log(user);
      if(!user){
        return  res.status(400).send({message:'Some Error Occured',success:false});
      }
     
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).send({message:'Password Updated',success:true})
    }catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  }

  const getverifiedController=async(req,res)=>{
    try{
      const user=await userModel.findOne({_id:req.params.userId});
      if(!user){
        return res.status(400).send({message:'User not found',success:false});
      }

       var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shubhamsur09@gmail.com',
          pass: 'cnpgkkumhduwgqub'
        }
      });
      
      var mailOptions = {
        from: 'shubhamsur09@gmail.com',
        to: user.email,
        subject: 'Verify Link',
        text: `http://localhost:3000/verify/${user._id}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          return res.status(400).send({message:"Some Error Occured",success:false});
        } else {
         return res.status(200).json({ message: "Mail Sent Successfully", success: true });
        }
      });

    }catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  }
  const verifyController=async(req,res)=>{
    console.log(req.body)
    try{
      const userId=req.body.userId
      const user=await userModel.findOne({_id:userId});
      console.log(user)
      if(!user){
        return res.status(400).send({message:'Some Error Occured',success:false});
        return;
      }
      user.verified=true;
      await user.save();
      return res.status(200).send({message:'User verified',success:true})
      return;
    }catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
      return;
    }
  }
  const getUserInfoController = async (req, res) => {
    try {
      const user = await userModel.findById(req.body.userId);
      return res.status(200).send({
        success: true,
        message: 'User data fetch success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  };

  const setPhoneController=async(req,res)=>{
    try{
      
      const phone=req.body.phone;
      const password=req.body.password;
      const userId=req.body.userId;
      const user=await userModel.findOne({_id:userId});
      // console.log(user)

      if(!user){
        return res.status(404).json({
          success: false,
          message: 'Some Error Occured',
        });
      }
      user.phone = phone;
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password=hashedPassword;
      await user.save();
      // console.log(user)

      return res.status(200).send({
        success: true,
        message: 'User data fetch success',
        data: user,
      });


    }catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  }

  const getInfoController = async (req, res) => {
    try {
      const user = await userModel.findOne({_id:req.params.userId});
      return res.status(200).send({
        success: true,
        message: 'User data fetch success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  };

  const authController = async (req, res) => {
    
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: error.message, // Include the error message for debugging (not recommended in production)
      });
    }
  };

  const applyCollegeController=async(req,res)=>{
    try{
        const newCollege=await collegeModel({...req.body,status:'pending'})
        await newCollege.save()
        const adminUser=await userModel.findOne({isAdmin:true})
        const notification=adminUser.notification
        notification.push({
            type:'apply-college-request',
            message:`${newCollege.name} has applied for a colleges Account`,
            data:{
                collegeId:newCollege._id,
                name:newCollege.name,
                onClickPath:'/college-request' 
            }
        })
        // await userModel.findByIdAndUpdate(adminUser._id)
        await userModel.findByIdAndUpdate(adminUser._id,{notification})
        return res.status(201).send({
            success:true,
            message:'College Account Applied Successfully',
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({success:false,error,message:'Error while applying College'})
    }


}
  

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    
    // Reverse the seennotification array
    const reversedSeenNotifications = seennotification.reverse();
    
    // Add new notifications to the reversedSeenNotifications array
    reversedSeenNotifications.push(...notification);
    
    user.notification = [];
    user.seennotification = reversedSeenNotifications;
    
    const updateUser = await user.save();

    return res.status(200).send({
      success: true,
      message: 'All notifications marked as read',
      data: updateUser,
      reversedSeenNotifications: reversedSeenNotifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Error in notification',
      success: false,
      error,
    });
  }
};


const deleteAllNotificationController=async(req,res)=>{
  try{
      const user=await userModel.findOne({_id:req.body.userId})
      user.notification=[]
      user.seennotification=[]
      const updateUser=await user.save()
      updateUser.password=undefined
      return res.status(200).send({
          success:true,
          message:'Notifications Deleted Successfully',
          data:updateUser,
      })
  }catch(error){
      console.log(error)
      return res.status(500).send({success:false,message:'unable to delete all notifications',error})
  }

}

const getAllCollegesController = async (req, res) => {
  try {
    const users = await userModel.find({ isCollege: true });

    // Create an array to store college data associated with users
    const collegeData = [];

    // Loop through each user to find the associated college and add it to the collegeData array
    for (const user of users) {
      const college = await collegeModel.findOne({ userId: user._id });
      if (college) {
        collegeData.push(college);
      }
    }

    return res.status(200).send({
      success: true,
      message: 'College data',
      data: collegeData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while fetching college data',
      error,
    });
  }
};


const UserController = async (req, res) => {
  try {
    const users = await userModel.find({  });

    // Create an array to store college data associated with users
    

    return res.status(200).send({
      success: true,
      message: 'College data',
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while fetching college data',
      error,
    });
  }
};


const followCollegeController = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you can retrieve the user ID from the request params

    const currentUser = await userModel.findById(userId);

    const collegeInfo = {
      collegeId: req.body.collegeId,
      collegeName: req.body.collegeName,
      collegeLocation: req.body.collegeLocation,
      collegeEmail: req.body.collegeEmail,
      photoUrl: req.body.photoUrl,
    };

    // Check if the user is already following the college
    const isAlreadyFollowing = currentUser.follow.some(
      (followedCollege) => followedCollege.collegeId === collegeInfo.collegeId
    );

    if (!isAlreadyFollowing) {
      // If not following, add the college to the user's follow array
      currentUser.follow.push(collegeInfo);
      await currentUser.save();
      const college=await userModel.findOne({_id:req.body.collegeId});
      if(!college){
        return res.status(400).send({message:'SomeThing went wrong',success:false});
      }
      const userInfo={
        userId:currentUser._id,
        name:currentUser.name,
        email:currentUser.email,
        photoUrl:currentUser.photoUrl,
        phone:currentUser.phone,
      }

      college.followers.push(userInfo);
      await college.save();



      return res.status(200).send({
        success: true,
        message: 'College followed successfully.',
      });

    } else {
      // If already following, remove the college from the user's follow array
      currentUser.follow = currentUser.follow.filter(
        (followedCollege) => followedCollege.collegeId !== collegeInfo.collegeId
      );
      await currentUser.save();

      return res.status(200).send({
        success: true,
        message: 'College unfollowed successfully.',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: 'Error while following/unfollowing college.',
    });
  }
};


const getFollowController=async(req,res)=>{
  try{
    const userId = req.params.userId;

    // Find the user by userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Extract collegeIds from the follow array
    const collegeIds = user.follow.map((followedCollege) => followedCollege.collegeId);

    // Find all colleges with the extracted collegeIds
    const followerColleges = await collegeModel.find({ userId: { $in: collegeIds } });

    return res.status(200).json({ success: true, data: followerColleges });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getFollowerController=async(req,res)=>{
  try {
    const userId  = req.params.userId;
    const { collegeId } = req.body;

    // Find the user by userId
    const user = await userModel.findById(userId);

    // Check if the user already follows the college
    if (user.follow.some((college) => college.collegeId === collegeId)) {
      return res.status(400).json({ success: false, message: 'User already follows this college' });
    }

    // Find the college by collegeId
    const college = await collegeModel.findOne({userId:collegeId});

    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    // Construct collegeInfo object based on the data you need
    const collegeInfo = {
      collegeId: college.userId,
      collegeName: college.name,
      collegeLocation: college.location,
      // Add other properties you need
    };

    // Add collegeInfo to the user's follow array
    user.follow.push(collegeInfo);

    // Save the user document with the updated follow array
    await user.save();

    return res.status(200).json({ success: true, message: 'User followed the college', collegeInfo });
  } catch (error) {
    console.error('Error following college:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong while following the college' });
  }
};
const unfollowCollege = async (req, res) => {
  try {
    console.log('Attempting to unfollow college...');
    const userId = req.params.userId;
    const collegeId = req.body.collegeId;

    // Find the user by userId
    const user = await userModel.findById(userId);
    const college = await userModel.findById(collegeId); // Use findById instead of find
    // console.log(user)
    // console.log(college)

    if (!user || !college) {
      return res.status(400).json({ success: false, message: 'User or college not found' });
      console.log("user not found")
    }

    // Check if the user follows the college
    const collegeIndex = user.follow.findIndex((college) => college.collegeId.toString() === collegeId);

    if (collegeIndex === -1) {
      return res.status(400).json({ success: false, message: 'User does not follow this college' });
      console.log()
    }

    // Remove the college from the user's follow array
    user.follow.splice(collegeIndex, 1);

    // Check if the college has the user in its followers
    const userIndex = college.followers.findIndex((follower) => follower.userId.toString() === userId);

    if (userIndex === -1) {
      return res.status(400).json({ success: false, message: 'User not found in college followers' });
    }

    // Remove the user from the college's followers array
    college.followers.splice(userIndex, 1);

    await college.save();
    await user.save();

    return res.status(200).json({ success: true, message: 'User unfollowed the college' });
  } catch (error) {
    console.error('Error unfollowing college:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong while unfollowing the college' });
  }
};


const storage = getStorage(firebase);
const uploadPhotoUrl = async (req, res) => {
  console.log(req.file)
  try {
    const photoBuffer = req.file.buffer; // Access the uploaded image data as a buffer


    if (!photoBuffer) {
      return res.status(400).json({
        success: false,
        message: 'No photo data provided in the request.',
      });
    }

    const storageRef = ref(storage, `images/`+req.file.originalname);
      const uploadTask = uploadBytesResumable(storageRef, photoBuffer);

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
    console.error('Error during file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during file upload',
      error: error.message,
    });
  }
};
const uploadVideoUrl = async (req, res) => {
  console.log(req.file)
  try {
    const photoBuffer = req.file.buffer; // Access the uploaded image data as a buffer


    if (!photoBuffer) {
      return res.status(400).json({
        success: false,
        message: 'No photo data provided in the request.',
      });
    }

    const storageRef = ref(storage, `videos/`+req.file.originalname);
      const uploadTask = uploadBytesResumable(storageRef, photoBuffer);

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
    // console.error('Error during file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during file upload',
      error: error.message,
    });
  }
};

// Example controller using Firebase Admin SDK for Firestore
const photoController = async (req, res) => {
  console.log(req.body)
  try {
    const { userId, photo } = req.body;
    const user = await userModel.findById(userId );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Error occurred',
      });
    }
    user.photoUrl = photo;
    // Save the user document with the updated photoUrl
    const college=await collegeModel.findOne({userId:user._id});
    if (college) {
      college.photoUrl = photo;
    
      await college.save();
    
      const posts = await postModel.find({ userId: user._id });
    
      if (posts) {
        for (const post of posts) {
          post.photoUrl = photo;
          await post.save();
        }
      }
    }
    
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Photo URL updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

const getCollegeInfoController=async(req,res)=>{
try{
  const userId=req.params.userId;
  const college=await collegeModel.findOne({userId:userId})
  if(!college){
      return  res.status(400).send({success:false,message:'User not found'});
  }

  return res.status(200).send({success:true,message:'User data fetch success',data:college})
}
catch(error){
  console.error(error);
  return res.status(500).send({success:false,message:'Something went wrong'})
}
}

const getAllFollowersController=async(req,res)=>{
  try{
    const userId=req.params.userId;
    const user=await userModel.findOne({_id:userId});
    if(!user){
      return res.status.send({message:'Not found',success:false});
    }
    let followers=[];
    for (const follower of user.followers) {
      // Assuming the follower data structure includes userId and other properties
      followers.push({
        userId: follower.userId,
        name:follower.name,
        email:follower.email,
        photoUrl:follower.photoUrl,
        phone:follower.phone,
      });
        
    }

    return res.status(200).send({message:'Fetched',success:true,data:followers});


  }catch(error){
    console.error(error);
    res.status(500).send({success:false,message:'Something went wrong'})
  }
}

module.exports={loginController,registerController,getUserInfoController,authController,getAllCollegesController,getverifiedController,
    applyCollegeController,getFollowController,UserController,getAllNotificationController,loginControllerGoogle,resetPasswordController,verifyController,
    getFollowerController,uploadPhotoUrl,photoController,getInfoController,uploadVideoUrl,setPhoneController,forgotPasswordController,getAllFollowersController
    ,unfollowCollege,getCollegeInfoController,deleteAllNotificationController,followCollegeController};

  
  