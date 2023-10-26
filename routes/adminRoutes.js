const express=require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsersController, getAllCollegesController, changeAccountStatusController,deleteAccountStatusController, deleteAccountController, getPostController, getVerification, getPremium } = require('../controllers/adminCtrl')

const router=express.Router()

router.get('/getAllUsers',authMiddleware,getAllUsersController)

router.get('/getAllColleges',authMiddleware,getAllCollegesController)

router.post('/getpost',authMiddleware,getPostController)


router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)
router.post('/deleteAccount',authMiddleware,deleteAccountController)
router.post('/deleteAccountStatus/:userId',deleteAccountStatusController)

router.post('/verify/:userId',getVerification);

router.post('/premium/:userId',getPremium);


module.exports=router