const place = require("../model/placesModel");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const image = require("../utilis/uploadimg");

const catchasync = require("../utilis/catchAsync");
const appError = require("../utilis/appError");
const { query } = require("express");
exports.uploadplaceImage = image.uploadSingleImage("image");
exports.resizeImage = catchasync(async (req, res, next) => {
  const filename = `place-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/places/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});
exports.getAllPlaces = catchasync(async (req, res, next) => {
  const places = await place.find(req.body);
  if (!places) {
    return next(new appError("no places found", 401));
  }

  res.status(200).json({
    status: "succes",
    places: places,
  });
});
exports.addplace = catchasync(async (req, res, next) => {
  const newplace = await place.create(req.body);
  if (!newplace) {
    return next(new appError("no place found", 401));
  }

  res.status(201).json({
    status: "succes",
    place: newplace,
  });
});
exports.deleteplace = catchasync(async (req, res, next) => {
  const places = await place.findByIdAndDelete(req.params.id);
  if (!places) {
    return next(new appError("no place found", 401));
  }

  res.status(204).json({
    status: "success",
    message: "donor has been deleted",
  });
});
exports.updateplace = catchasync(async (req, res, next) => {
  const places = await place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!places) {
    return next(new appError("no places found", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      places,
    },
  });
});
