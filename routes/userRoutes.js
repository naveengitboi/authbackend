import express from 'express'
const router = express.Router()
import UserController from '../controllers/userController.js'
import checkAuth from '../middlewares/auth-middleware.js'

//Route Level middleware - To protect route
router.post('/changepassword', checkAuth)


//Public router
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

//Protected Router

router.post('/changepassword', UserController.changePassword)


export default router