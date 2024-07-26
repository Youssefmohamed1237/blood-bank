const mongoose = require("mongoose");
const placeschema = new mongoose.Schema({
  hospitalname: {
    type: String,
    required: [true, "name is required"],
  },
  image: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  addres: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});
placeschema.post("init", (doc) => {
  if (doc.image) {
    const imagurl = `${process.env.BASE_URL}/places/${doc.image}`;
    doc.image = imagurl;
  }
});
const place = mongoose.model("place", placeschema);
module.exports = place;
