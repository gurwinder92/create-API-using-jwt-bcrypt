const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment")
const model = require("../model/userModel");
const otpMoel = require("../model/otpModel");

async function register(req, res) {
  let check = await model.findOne({ email: req.body.email });
  const { password } = req.body;
  encryptedPassword = await bcrypt.hash(password, 10);

  if (!check) {
    let createUser = await model.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: encryptedPassword,
    });
    return res.status(200).send({
      msg: "ok",
      data: createUser,
    });
  }
  return res.status(400).send({
    msg: "user allready exist",
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await model.findOne({ email: email });
  if (user) {
    let comp = await bcrypt.compare(password, user.password);
    if (comp) {
      let data = {};
      const token = jwt.sign({ _id: user._id }, "thisistoken");
      data.user = user;
      data.token = token;
      return res.status(200).send({
        msg: "user login successful",
        data: data,
      });
    }
  }
  return res.status(400).send({
    msg: "password not match",
  });
}

async function changePassword(req, res) {
  try {
    encryptedPassword = await bcrypt.hash(req.body.password, 10);

    let newPassword = await model.findOneAndUpdate(
      { _id: req.user._id },
      { password: encryptedPassword },
      { upsert: true, new: true }
    );
    return res.status(200).send({
      msg: "password change successfully",
      data: newPassword,
    });
  } catch (error) {
    console.log(error);
  }
}

async function forgetPassword(req, res) {
  try {
    let otp = Math.floor(Math.random() * 10000 + 1);
      let data = {
        otpCode: otp,
       email:req.user.email,
        time : moment().format()
      } 
      let sendOtp = await otpMoel.create(data);
      return res.status(200).send({
        msg: "otp send successfully",
        data: sendOtp,
      });
    
  } catch (error) {
    console.log(error);
  }
}
async function resetPassword(req, res) {
  try {
          let compare = await otpMoel.findOne({
        //  email: req.body.email,
        otpCode: req.body.otpCode,
      });
      encryptedPassword = await bcrypt.hash(req.body.password, 10)
      if (compare) {
        let setPassword = await model.findOneAndUpdate(
          { email: req.body.email },
          { password: encryptedPassword },
          { upsert: true, new: true }
        );
        await otpMoel.findOneAndDelete({
          email: req.body.email,      
          otpCode: req.body.otpCode,
        });
        return res.status(200).send({
          msg: "password reset successfully",
          data: setPassword,
        });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  register,
  login,
  changePassword,
  forgetPassword,
  resetPassword,
};
