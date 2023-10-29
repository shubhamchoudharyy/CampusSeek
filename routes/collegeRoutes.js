const express=require('express');
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for file upload
const upload = multer({ storage: storage });

const authMiddleware = require('../middlewares/authMiddleware');
const { getCollegeInfoController, addCoursesController,  uploadFile,  getPendingInfoController,
     removeCourseController, updateController, postController,
      videoController, getPostController, descriptionController, rateController, getPostsController, getDeletePostController, ViewController, getAllViewsController, getOnePostController, getPaymentController, successController, premiumCheckController,  } = require('../controllers/collegeCtrl');

const router=express.Router();

router.post('/getCollegeInfo',authMiddleware,getCollegeInfoController)



router.post('/pendinginfo/:userId',getPendingInfoController)

router.post('/deletepost',getDeletePostController)


router.post('/addCourses',authMiddleware,addCoursesController)
router.post('/getViews/:userId',getAllViewsController)

router.post('/remove',authMiddleware,removeCourseController)

router.post('/update',authMiddleware,updateController)

router.post('/post',authMiddleware,postController)

router.post('/getpost',authMiddleware,getPostController)

// router.post('/getposted',authMiddleware,getPostedController)

router.post('/getposts/:userId',authMiddleware,getPostsController)

router.post('/video',authMiddleware,videoController)

router.post('/description',authMiddleware,descriptionController)

router.post('/rate/:userId',rateController);

router.post('/views/:userId',ViewController);

router.post('/onePost/:userId',getOnePostController);

router.post('/upload',upload.single('file'),uploadFile)

router.post('/create-checout-session',getPaymentController)

router.post('/success',successController)

router.post('/premiumcheck',premiumCheckController)

module.exports=router