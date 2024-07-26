const need = require("../model/needModel");
const catchasync = require("../utilis/catchAsync");
const appError = require("../utilis/appError");
const sendEmail = require("../utilis/sendemail");

exports.getAllneed = catchasync(async (req, res, next) => {
  const needs = await need.find();
  if (!needs) {
    return next(new appError("no needs found", 401));
  }

  res.status(200).json({
    status: "succes",
    needs: needs,
  });
});
exports.addneed = catchasync(async (req, res, next) => {
  console.log(Date.now());
  const newneed = await need.create(req.body);
  if (!newneed) {
    return next(new appError("no needs found", 401));
  }
  const message = `hello ${newneed.name}  thank you for donating blood your donate can save human alive
please go to ${newneed.hospitalname} at ${newneed.bookingdate}


 

 



 with our best wishes 
    revive team`;
  await sendEmail({
    email: newneed.email,
    subject: "Appointment booking to donate blood",
    message,
  });

  res.status(201).json({
    status: "succes",
    need: newneed,
  });
});
exports.deleteneed = catchasync(async (req, res, next) => {
  const needs = await need.findByIdAndDelete(req.params.id);
  if (!needs) {
    return next(new appError("no needs found", 401));
  }

  res.status(204).json({
    status: "success",
    message: "need has been deleted",
  });
});
exports.updateneed = catchasync(async (req, res, next) => {
  const needs = await need.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!needs) {
    return next(new appError("no needs found", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      needs,
    },
  });
});
