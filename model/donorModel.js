const mongoose = require("mongoose");
const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");
const donorschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    default: null,
    // unique: true,
    validate: [validator.isEmail, "email should be valid"],
  },
  name: {
    type: String,
    required: [true, "please enter the name"],
    default: null,
  },
  profileImg: {
    type: String,
    default: null,
    // required: [true, "profile image is required"],
  },

  phone: {
    type: String,
    required: true,
    default: null,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, "ar-EG");
      },
      message: "not valid  mobile phone",
    },
  },
  bloodType: {
    type: String,
    required: true,
    default: null,
    enum: {
      values: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      message: "blood type is not sutiable",
    },
  },
  city: {
    type: String,
    default: null,
    required: [true, "city is required"],
  },

  message: {
    type: String,
    default: null,
  },
});
donorschema.post("init", (doc) => {
  if (doc.profileImg) {
    const imagurl = `${process.env.BASE_URL}/donor/${doc.profileImg}`;
    doc.profileImg = imagurl;
  }
});
const donor = mongoose.model("donor", donorschema);
module.exports = donor;
