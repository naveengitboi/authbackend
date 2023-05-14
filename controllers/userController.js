import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
class UserController {

  //register code
  static userRegistration = async (req, res) => {
    const { name, email, password, passwordConfimation, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      if (name && email && password && passwordConfimation && tc) {
        if (password === passwordConfimation) {
          try {
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password,salt)
            const newUser = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });

            await newUser.save();
            const savedUser = await UserModel.findOne({email:email})

            //Generate web token
            const token =  jwt.sign({userID: savedUser._id}, process.env.JWT_SECRET_KEY, {expiresIn:'5d'})

            res.send({'status':"Registed", "message":"registerd Successfully", "token":token })
          } catch (error) { 
            res.send({"status":"failed", "message":"Unable to register"})
          }
        } else {
          res.send({ "status": "failed", "message": "Passowrds are not matched" });
        }
      } else {
        res.send({ "status": "failed", "message": "All form are required" });
      }
    } else {
      res.status(201).send({ "status": "failed", "message": "Already user exists" });
    }
  };


  //userLogin code 

  static userLogin = async(req,res) => {
    try {
      const {email, password} = req.body 
      if(email && password){
        const user =  await UserModel.findOne({email:email})
        if(user){
          const isMatch = await bcrypt.compare(password, user.password)
          console.log(isMatch)
          if(isMatch){
            //generate jwt token
            const token = jwt.sign({userID: user._id },process.env.JWT_SECRET_KEY, {expiresIn:'5d'})


            res.send({"status":"Success", "message":"Login Successed", "token":token})
          }
          else
          {
            res.send({"status":"failed", "message":"Email or password is wrong"})
          }
        }
        else{
          res.send({"status":"failed", "message":"New user, please log in"})
        }
      }
      
    } catch (error) {
      res.send({"status":"failed", "message":"Unable to log in"})
      
    }
  }

  //Change password code

  static changePassword = async (req,res) => {
    const {password, passwordConfimation} = req.body
    if(password && passwordConfimation){
      if(password === passwordConfimation){
        const salt = await bcrypt.genSalt(12)
        const newHashPassword = await bcrypt.hash(password,salt)

        await UserModel.findByIdAndUpdate(req.user._id, {$set:{
          password: newHashPassword
        }})
        res.send({"status":"success", "message":"passwords changed successfully"}) 
      }
      else 
      {
        res.send({"status":"failed", "message":"enter correct password to proceed"})
      }
    }
  }

  //My profile code
  static loggedUser = async (req,res)=>{
    res.send({"user":req.user})
  }

  //forgot password link sender to mail
  static sendUserPasswordResetEmail = async (req,res) => {
    const {email} = req.body 
    if (email){
      const user = await UserModel.findOne({email:email})
      if(user){
        const secret = user._id + process.env.JWT_SECRET_KEY
        const token = jwt.sign({userID:user._id}, secret, {expiresIn:"15m"})

        //frontend link router (/api/user/:id/:token)
        const resetLink = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        res.send({"status":"success", "message":"Reset Link sent to your registerd Account"})
      }
      else{
        res.send({"status":"failed", "message":"This email not exist"})
      }
    }else{
      res.send({"status":"failed", "message":"please enter valid email"})
    }
  }

  //entering new passwords 
  static userNewPassowrds = async (req,res) => {
    const {password, passwordConfimation} = req.body 
    const {id, token} = req.params 
    const user = await UserModel.findById(id)
    const newSecret = user._id + process.env.JWT_SECRET_KEY
    try {
      //verfying link whether it is expired or not with token and secret key
      jwt.verify(token, newSecret)
      if(password && passwordConfimation){
        if(password === passwordConfimation){
          //password hashing 
          const salt = await bcrypt.genSalt(12)
          const newUpdatedHashPassword = await bcrypt.hash(password, salt)
          //updating to new password
          await UserModel.findByIdAndUpdate(id, {$set:{
            password: newUpdatedHashPassword
          }})
          res.send({"status":"success", "message":"Password updated successfully"})
        }
        else{
          res.send({"status":"Failed", "message":"Both passwords should be same"})
        }
      }
      else{
        res.send({"status":"Failed", "message":"Both the fields are required"})
      }
      
    } catch (error) {
      res.send({"status":"failed", "message":"Link expired or time out" })
      
    }
  }

}


export default UserController