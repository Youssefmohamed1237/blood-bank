const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const db = process.env.DATA_BASE;
mongoose
  .connect(db)
  .then((con) => {
    console.log("db connect succefuly..");
  })
  .catch(() => {
    console.log("connectionn faild");
  });
const port=process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
