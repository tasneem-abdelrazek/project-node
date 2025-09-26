import userCollection from "../Database/Models/userModel.js"

const checkMail = async(req, res, next) => {
    const {email} = req.body
    const existingUser = await userCollection.where("email" , "==", email).get()
     if(existingUser.empty){
        next()
     }else{
        res.status(409).send("User Already Registered")
    }
}

export default checkMail