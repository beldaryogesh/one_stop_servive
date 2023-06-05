const userModel =require("../models/")

const ExpiryCheck = async(req,res,next) => {
    try {
        let userId = req.userId
        const user = await userModel.find({_id:userId});
        if(user.usertype == 'seller')
        {
            const expirationDate = user.createdAt
            console.log(expirationDate);
            expirationDate = expirationDate.setMonth(expirationDate.getMonth() +6);
            if(Date.now() > expirationDate) {
                return res.status(400).send({
                    message : 'Subscription Expired'
                })
            }
        }
        next();
    } catch (error) {
        return res.status(500).send({status : false , message : error.message})
    }
}


module.exports = {ExpiryCheck}