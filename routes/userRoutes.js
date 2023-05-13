import express from 'express'
const router = express.Router()
import UserController from '../controllers/userController.js'

//Public router
router.post('/register', UserController.userRegistration)

//Protected Router


export default router