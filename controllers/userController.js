import UserModel from "../models/user.js";
import bcrypt from "bcrypt";

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
            res.send({'status':"Registed", "message":"registerd Successfully"})
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
}


export default UserController