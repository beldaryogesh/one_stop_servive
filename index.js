const express = require("express");
const { default: mongoose } = require("mongoose");
const authRoute = require("./routes/authRoute.js")
const adminRoute = require("./routes/adminRoute.js")
const userRoute = require("./routes/userRoute.js")
const serviceRoute = require("./routes/serviceRoute.js")
const subscriptionRoute = require('./routes/subscriptionRoute.js')
const subscriptionModel = require('./models/subscriptionModel.js')

const bodyParser = require("body-parser")
const multer = require("multer")
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

const URL =
'mongodb+srv://yogesh_beldar:Oh9CU4nZCayFGTeC@cluster0.zveoo.mongodb.net/AppziaTechnology'
const connectDb = async() => {
  try {
   await create_Subscription()
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
app.use('/', subscriptionRoute )



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



async function create_Subscription (req, res){
  try {
      const quauterly_plan = {
          subscriptionName: "quauterly plan",
          description: "this plan is for one year. you can show your service to the Customer for One year", 
          subscriptionPrice: 1500
      }
      const half_yearly_plan = {
          subscriptionName :  "half yearly plan",
           description : "this plan is for six month. you can show your service to the Customer for sis month", 
           subscriptionPrice  : 1000
      }
      let annual_plan = {
          subscriptionName :  "annual plan",
           description : "this plan is for three month. you can show your service to the Customer for three month", 
           subscriptionPrice  : 700
      }

     await subscriptionModel.insertMany([quauterly_plan, half_yearly_plan, annual_plan])
      
  } catch (error) {
      return res.status(500).send({status : false, message : error.message})
  }
}
