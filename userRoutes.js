const express = require("express");
const user = require("../services/useServices");
const auth = require("../services/authServices")
const router = express.Router();

router.post("/register", user.register);
router.post("/login", user.login);
router.put("/changePassword",auth.userVerify, user.changePassword);
router.post("/forgetPassword",auth.emailVerify ,user.forgetPassword);
router.put("/resetPassword", user.resetPassword);

module.exports = router;
