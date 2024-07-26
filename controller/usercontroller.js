const User = require("../model/userModel");
const catchAsync = require("../utilis/catchAsync");
const appError = require("../utilis/appError");
const filterobj = (obj, ...allowedfields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordconfirm) {
    return next(
      new appError(
        "to change your password please use this route /updatemypassword"
      )
    );
  }
  const filteredbody = filterobj(req.body, "name", "email");
  const updateuser = await User.findByIdAndUpdate(req.user.id, filteredbody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updateuser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleteMe = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: "success",
  });
});
