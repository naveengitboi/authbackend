import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
class UserController {
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

  static changePassword = async (req,res) => {
    const {password, passwordConfimation} = req.body 
    if(password && passwordConfimation){
      if(password === passwordConfimation){
        const salt = await bcrypt.genSalt(12)
        const newHashPassword = await bcrypt.hash(password,salt)
        
        res.send({"status":"success"})
      }
      else 
      {
        res.send({"status":"failed", "message":"enter correct password to proceed"})
      }
    }
  }
}


export default UserController