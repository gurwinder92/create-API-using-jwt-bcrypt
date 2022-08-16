const model = require("../model/userModel")
const jwt = require("jsonwebtoken")

 
exports.userVerify = async (req, res, next) => {
    try {
        let token = req.headers.token
        let verify = await jwt.verify(token,"thisistoken")
        let check = await model.findById(verify._id).lean()
        if(check){
            req.user = check,
            next()
        }
    } catch (error) {
        return res.status(400).send({
            msg:"user not verifyed",
            data:error
        })
    }
}
exports.emailVerify = async (req, res, next) => {
    try {
       
        let check = await model.findOne({email:req.body.email})
         if(check){
            req.user = check,
            next()
        }
    } catch (error) {
        return res.status(400).send({
            msg:"user not verifyed",
            data:error
        })
    }
}