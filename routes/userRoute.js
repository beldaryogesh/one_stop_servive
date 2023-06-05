const express = require('express');
const Router = express.Router()
const commonMid = require("../middlwares/midd")

const userController = require("../controllers/userController")




Router.get('/getData', userController.getData)
Router.put('/update/:userId', userController.updateUser )
Router.delete('/deleteUser/:userId', userController.deleteUser)



module.exports= Router;







