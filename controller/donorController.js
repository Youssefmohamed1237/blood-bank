const donor = require("../model/donorModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const image = require("../utilis/uploadimg");

const catchasync = require("../utilis/catchAsync");
const appError = require("../utilis/appError");
exports.uploadUserImage = image.uploadSingleImage("profileImg");

// Image processing
exports.resizeImage = catchasync(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/donor/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});
exports.getAllDonor = catchasync(async (req, res, next) => {
  const donors = await donor.find();
  if (!donors) {
    return next(new appError("no donors found", 401));
  }

  res.status(200).json({
    status: "succes",
    donors: donors,
  });
});
exports.addDonor = catchasync(async (req, res, next) => {
  const newdonor = await donor.create(req.body);
  if (!newdonor) {
    return next(new appError("no donors found", 401));
  }

  res.status(201).json({
    status: "succes",
    donor: newdonor,
  });
});
exports.deleteDoner = catchasync(async (req, res, next) => {
  const donors = await donor.findByIdAndDelete(req.params.id);
  if (!donors) {
    return next(new appError("no donors found", 401));
  }

  res.status(204).json({
    status: "success",
    message: "donor has been deleted",
  });
});
exports.updateDoner = catchasync(async (req, res, next) => {
  const donors = await donor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!donors) {
    return next(new appError("no donors found", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      donors,
    },
  });
});
