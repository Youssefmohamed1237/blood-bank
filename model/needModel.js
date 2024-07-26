const mongoose = require("mongoose");
const validator = require("validator");
const needschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the name"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "email should be valid"],
  },
  hospitalname: {
    type: String,
    required: [true, "hospital name enter the name"],
  },

  bookingdate: {
    type: Date,
    required: [true, "booking date is required"],
    validate: {
      validator: function (el) {
        return el > Date.now();
      },
      message: "not suitable date",
    },
  },

  bloodType: {
    type: String,
    required: true,
    enum: {
      values: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "unknown"],
      message: "blood type is not sutiable",
    },
  },
  city: {
    type: String,
    required: [true, "city is required"],
  },
});

const need = mongoose.model("need", needschema);
module.exports = need;
