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
    await create_Subscription();
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
    app.listen(PORT, () => {
      console.log(`express app running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

async function create_Subscription(req, res) {
  try {
    let subscription = await subscriptionModel.find({});
    if (subscription.length == 0) {
      const quauterly_plan = {
        subscriptionName: "quauterly plan",
        description:
          "this plan is for one year. you can show your service to the Customer for One year",
        subscriptionPrice: 1500,
        subscriptionMonth: 12,
      };
      const half_yearly_plan = {
        subscriptionName: "half yearly plan",
        description:
          "this plan is for six month. you can show your service to the Customer for six month",
        subscriptionPrice: 1000,
        subscriptionMonth: 6,
      };
      let annual_plan = {
        subscriptionName: "annual plan",
        description:
          "this plan is for three month. you can show your service to the Customer for three month",
        subscriptionPrice: 700,
        subscriptionMonth: 3,
      };

      await subscriptionModel.insertMany([
        quauterly_plan,
        half_yearly_plan,
        annual_plan,
      ]);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
