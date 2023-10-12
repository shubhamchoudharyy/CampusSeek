const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const collegeModel = require('../model/collegeModel');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getDownloadURL, getStorage } = require('firebase/storage');
const firebase=require('../firebase')

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('../major-de7cb-firebase-adminsdk-m7g1l-a08618d106.json'); // Replace with the path to your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://major-de7cb.appspot.com',
});



const { ref, uploadBytesResumable } = require('firebase/storage');
const postModel = require('../model/postsModel');

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
      res.status(201).send({ message: "Register Sucessfully", success: true });
    } catch (error) {
      console.log(error);
      res.status(500).send({
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
      
      res.status(200).json({ message: "Login Success", success: true, token,user });
      
      
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
  };


  const getUserInfoController = async (req, res) => {
    try {
      const user = await userModel.findById(req.body.userId);
      res.status(200).send({
        success: true,
        message: 'User data fetch success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  };


  const getInfoController = async (req, res) => {
    try {
      const user = await userModel.findOne({_id:req.params.userId});
      res.status(200).send({
        success: true,
        message: 'User data fetch success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: error.message,
        message: 'Error in fetching details',
      });
    }
  };

  const authController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId }, { password: 0 });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
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
        res.status(201).send({
            success:true,
            message:'College Account Applied Successfully',
        })
    }catch(error){
        console.log(error)
        res.status(500).send({success:false,error,message:'Error while applying College'})
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

    res.status(200).send({
      success: true,
      message: 'All notifications marked as read',
      data: updateUser,
      reversedSeenNotifications: reversedSeenNotifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
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
      res.status(200).send({
          success:true,
          message:'Notifications Deleted Successfully',
          data:updateUser,
      })
  }catch(error){
      console.log(error)
      res.status(500).send({success:false,message:'unable to delete all notifications',error})
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

    res.status(200).send({
      success: true,
      message: 'College data',
      data: collegeData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
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
    

    res.status(200).send({
      success: true,
      message: 'College data',
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
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

      res.status(200).send({
        success: true,
        message: 'College followed successfully.',
      });
    } else {
      // If already following, remove the college from the user's follow array
      currentUser.follow = currentUser.follow.filter(
        (followedCollege) => followedCollege.collegeId !== collegeInfo.collegeId
      );
      await currentUser.save();

      res.status(200).send({
        success: true,
        message: 'College unfollowed successfully.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
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

    res.status(200).json({ success: true, message: 'User followed the college', collegeInfo });
  } catch (error) {
    console.error('Error following college:', error);
    res.status(500).json({ success: false, message: 'Something went wrong while following the college' });
  }
};
const unfollowCollege = async (req, res) => {
  try {
    console.log('Attempting to unfollow college...');
    const userId = req.params.userId;
    const { collegeId } = req.body;

    // Find the user by userId
    const user = await userModel.findById(userId);

    // Check if the user follows the college
    const collegeIndex = user.follow.findIndex((college) => college.collegeId.toString() === collegeId);

    if (collegeIndex === -1) {
      return res.status(400).json({ success: false, message: 'User does not follow this college' });
    }

    // Remove the college from the user's follow array
    user.follow.splice(collegeIndex, 1);

    // Save the user document with the updated follow array
    await user.save();

    res.status(200).json({ success: true, message: 'User unfollowed the college' });
  } catch (error) {
    console.error('Error unfollowing college:', error);
    res.status(500).json({ success: false, message: 'Something went wrong while unfollowing the college' });
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
    res.status(500).json({
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
    console.error('Error during file upload:', error);
    res.status(500).json({
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
    res.status(200).json({
      success: true,
      message: 'Photo URL updated successfully',
    });
  } catch (error) {
    res.status(500).json({
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
      res.status(400).send({success:false,message:'User not found'});
  }

  res.status(200).send({success:true,message:'User data fetch success',data:college})
}
catch(error){
  console.error(error);
  res.status(500).send({success:false,message:'Something went wrong'})
}
}
module.exports={loginController,registerController,getUserInfoController,authController,getAllCollegesController,
    applyCollegeController,getFollowController,UserController,getAllNotificationController,
    getFollowerController,uploadPhotoUrl,photoController,getInfoController,uploadVideoUrl
    ,unfollowCollege,getCollegeInfoController,deleteAllNotificationController,followCollegeController};

  
  