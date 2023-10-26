const express=require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for file upload
const upload = multer({ storage: storage });

// Import the URL controller
 // Update the path to your controller file

// Define the route handler



const authMiddleware=require('../middlewares/authMiddleware');
const { loginController, registerController,getUserInfoController
    ,authController,applyCollegeController,getAllNotificationController,deleteAllNotificationController,
     getAllCollegesController, followCollegeController,unfollowCollege,getFollowerController, UserController, getFollowController
    ,photoController,uploadPhotoUrl,getInfoController, getCollegeInfoController, uploadVideoUrl, loginControllerGoogle, setPhoneController, forgotPasswordController, resetPasswordController, verifyController, getAllFollowersController, getverifiedController } = require('../controllers/userCtrl');

const router=express.Router();

router.post('/login',loginController);
router.post('/google-login',loginControllerGoogle);
router.post('/register', registerController);

router.post('/forget-password', forgotPasswordController);

router.post('/reset-password', resetPasswordController);

router.post('/verify', verifyController);

router.post('/getverified/:userId',getverifiedController);

router.post('/getUserInfo/',authMiddleware, getUserInfoController);

router.post('/setPhone',authMiddleware, setPhoneController);

router.post('/info/:userId', getInfoController);

router.post('/getInfo/:userId', getCollegeInfoController);

router.post('/getUserData',authMiddleware,authController)

router.post('/apply-college',authMiddleware,applyCollegeController);

router.post('/photo',authMiddleware,photoController)

router.post('/Url', upload.single('fieldname'), uploadPhotoUrl);

router.post('/videoUrl', upload.single('fieldname'), uploadVideoUrl);

// router.post('/Url', upload.single('photo'), UrlController);

router.post('/get-all-notification',authMiddleware,getAllNotificationController)

router.post('/delete-all-notification',authMiddleware,deleteAllNotificationController)

router.get('/getAllColleges',authMiddleware,getAllCollegesController)

router.get('/getUsers',authMiddleware,UserController)

router.post('/followCollege/:userId', authMiddleware,followCollegeController);

router.get('/getfollow/:userId', authMiddleware,getFollowController);

router.post('/followerCollege/:userId',authMiddleware,getFollowerController)

router.post('/unfollowCollege/:userId',authMiddleware,unfollowCollege)

router.post('/getAllFollowers/:userId',getAllFollowersController)

module.exports=router;