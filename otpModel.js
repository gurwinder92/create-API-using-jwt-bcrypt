const express = require("express");
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otpCode: { type: String },
  email: { type: String },
  time:{type: String}
});

module.exports = mongoose.model("otp", otpSchema);
