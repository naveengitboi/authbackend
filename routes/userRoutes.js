import express from 'express'
const router = express.Router()
import UserController from '../controllers/userController.js'
import checkAuth from '../middlewares/auth-middleware.js'

//Route Level middleware - To protect route
router.use('/changepassword', checkAuth)
router.use('/myprofile', checkAuth)


//Public router
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/forgotpassword', UserController.sendUserPasswordResetEmail)
router.post('/fotgotpassword/resetpassword/:id/:token', UserController.userNewPassowrds)
//Protected Router

router.post('/changepassword', UserController.changePassword)
router.get('/myprofile', UserController.loggedUser)

export default router