require("dotenv").config()
const bodyParser = require("body-parser")
const express = require("express")
const { Db } = require("mongodb")
const _=require("lodash")
const app =express()
const mongoose =require("mongoose")
// const encrypt= require("mongoose-encryption")
// const md5 =require("md5")
const bcrypt =require("bcrypt")
const saltRounds=10
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO);
      console.log("connected");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  const userschema= new mongoose.Schema({
    name:String,
    password:String
  })
  // console.log(process.env.SECRET)

  // userschema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});

  const Users=mongoose.model("Users",userschema)
app.get("/",(req,res)=>{
  res.render("home")
})
app.get("/login",(req,res)=>{
  res.render("login")
})
app.get("/register",(req,res)=>{
  res.render("register")
})
app.post("/register",(req,res)=>{
  bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
    
    const name =req.body.username
    const password =hash
    Users.findOne({name:name}).then((found)=>{
      if(found){
        res.send("this email already exist")
      }else{
        const user= new Users({
          name:name,
          password:password
        })
        user.save().then((err)=>{
          if(err){
            res.render("secrets")
          }else{
            console.log(err)
          }
        })
      }
    })
  })
})
app.post("/login",(req,res)=>{   
    const name =req.body.username
    const password =req.body.password
    Users.findOne({name:name}).then((found)=>{
      if(found){
        bcrypt.compare(password,found.password,(err,result)=>{
          if(result=== true){
          res.render('secrets')}
          else{
            res.send("<h1>check your password </h1>")
          }
        })
}
})
})
bcrypt.hash("123456",5,(err,hash)=>{
    console.log(hash)
})
connectDB().then(() => {0
    app.listen( process.env.PORT, () => {
      console.log("listening for requests");
    })
  })
  