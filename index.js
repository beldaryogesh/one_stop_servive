const express = require("express");
const { default: mongoose } = require("mongoose");
const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const serviceRoute = require("./routes/serviceRoute.js");
const subscriptionRoute = require("./routes/subscriptionRoute.js");
const subscriptionModel = require("./models/subscriptionModel.js");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());
const URL =
  "mongodb+srv://yogesh_beldar:Oh9CU4nZCayFGTeC@cluster0.zveoo.mongodb.net/AppziaTechnology";
const connectDb = async () => {
  try {
    mongoose.connect(URL, { useNewUrlParser: true });
    console.log("mongoDB is connected");
  
  } catch (error) {
    console.log(error);
  }
};

app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", authRoute);
app.use("/", serviceRoute);
app.use("/", subscriptionRoute);


const PORT = 3000;
const start = async () => {
  try {
    await connectDb();
    app.listen(PORT,'192.168.0.233');
    // app.listen(PORT, () => {
    //   console.log(`express app running on port ${PORT}`);
    // });
    
  } catch (error) {
    console.log(error);
  }
};

start();
