const User = require("../model/userModel");
const catchAsync = require("../utilis/catchAsync");
const jwt = require("jsonwebtoken");
const appError = require("../utilis/appError");
const { token } = require("morgan");
const { promisify } = require("util");
const sendEmail = require("../utilis/sendemail");
const crypto = require("crypto");
const app = require("../app");

const jwttoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = jwttoken(user._id);
  const cookiesoptoin = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookiesoptoin.secure = true;
  }
  res.cookie("jwt", token, cookiesoptoin);
  res.status(statusCode).json({
    token,
    status: "succes",
    user,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newuser = await User.create(req.body);
  createSendToken(newuser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError("please provide email and password", 400));

  const user = await User.findOne({ email });
  if (!user || !(await user.correctpass(password, user.password)))
    return next(new appError("invalid email or password", 401));
  createSendToken(user, 201, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token) return next(new appError("you should login ", 401));

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  const curentUser = await User.findById(decoded.id);
  if (!curentUser) {
    return next(new appError("user not exist please login agin", 401));
  }
  if (curentUser.changedPasswordAfter(decoded.iat)) {
    return next(new appError("you change you password please login agin", 401));
  }
  req.user = curentUser;
  next();
});
exports.allowTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new appError("you do not have the role to acces that", 403));
    }
    next();
  };
};
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new appError("user not found by this email"), 400);

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword/${resetToken}`;
  const message = `you resForgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      to: user.email,
      subject: "your reset code to cahnge your password",
      message: message,
    });
    res.status(200).json({
      status: "succes",
      message: "check your inobx to resset your password",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetexpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new appError("something went wrong try agin", 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetexpire: { $gt: Date.now() },
  });
  if (!user) return next(new appError("Token is invalid or has expired", 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetexpire = undefined;
  await user.save();
  createSendToken(user, 200, res);
});
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user.correctpass(req.body.curentpassword, user.password))
    return next(new appError("the password is not correct", 401));
  user.password = req.body.newpassword;
  user.passwordConfirm = req.body.newpasswordconfirm;
  await user.save();
  createSendToken(user, 200, res);
});
