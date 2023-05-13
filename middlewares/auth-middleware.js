import jwt, { verify } from 'jsonwebtoken'
import UserModel from '../models/user.js'


let checkAuth = async (req,res,next) => {
    let token
    const {authorization} = req.headers 
    if(authorization && authorization.startsWith('Bearer')){
       try {
        //get token from header
         token = authorization.split(' ')[1]
         console.log(token)
        
        //verify token and get userID
        const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

        //get user from token 
        req.user = await UserModel.findById(userID).select('-password')
        next()
       } catch (error) {
        res.send({"status":"failed", "message" :"unauthorized user bro"})
       }
        
    }
    else{
         res.send({"status":"failed", "message" :"No token"})
    }
}


export default checkAuth