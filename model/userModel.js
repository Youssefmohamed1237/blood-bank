const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { bool } = require("sharp");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is requiured"],
    unique: true,
    validate: [validator.isEmail, "please provide a valid email"],
    lowercase: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, " please confirm password"],
    validate: function (el) {
      return this.password === el;
    },
  },

  role: {
    type: String,
    enum: ["user", "admin", "manger"],
    defult: "user",
  },
  passwordchangedAt: Date,
  passwordResetToken: String,
  passwordResetexpire: Date,
  active: {
    type: Boolean,
    defult: true,
    select: false,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordchangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctpass = (candidatepassword, password) => {
  return bcrypt.compare(candidatepassword, password);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordchangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordchangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetexpire = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
