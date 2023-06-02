const express = require("express");
const { default: mongoose } = require("mongoose");
const authRoute = require("./routes/authRoute.js")
const adminRoute = require("./routes/adminRoute.js")
const userRoute = require("./routes/userRoute.js")
const serviceRoute = require("./routes/serviceRoute.js")
const bodyParser = require("body-parser")
const multer = require("multer")
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

const URL =
'mongodb+srv://yogesh_beldar:Oh9CU4nZCayFGTeC@cluster0.zveoo.mongodb.net/AppziaTechnology'
const connectDb = () => {
  try {
    mongoose.connect(URL, {useNewUrlParser: true});
    console.log("mongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};



app.use("/", authRoute);
app.use("/" , adminRoute);
app.use("/", userRoute);
app.use('/', authRoute);
app.use('/', serviceRoute )

const PORT = 3000;
const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`express app running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
