const express = require("express")
const { connection } = require("./config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var cors = require('cors')
const { userModel } = require("./models/User.model")
const cookieParser = require("cookie-parser")


const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin:"*"
}))





app.get("/",(req,res)=>{
    
    console.log(req.cookies);
    res.send("Weather")
})
app.post("/signup",(req,res)=>{
    const {username,email,password} = req.body;
    try {
        bcrypt.hash(password,4,async(err,hash)=>{
            const user = new userModel({username:username,email:email,password:hash})
            await user.save();
            res.send("Success")
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/login",async(req,res)=>{
    res.cookie("name","yogendra")
    const {email,password} = req.body
    try {
        const user  = await userModel.find({email:email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    const token = jwt.sign({"userID":user[0]._id},'yogi')
                  res.cookie("access_token", token, {
                      httpOnly: true,
                    })

                    res.send({"Msg":"Login sUCCESS","TOKEN":token})
                }
                else{
                    res.send("Invalid Detail");
                }
            })
        }
    } catch (error) {
        console.log(error);
    }

})

app.listen(8081,async()=>{
    try{
        await connection
        console.log("Connected to DB");
    }
    catch{

    }
})