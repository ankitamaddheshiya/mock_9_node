require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connection } = require("./config/db")
const {userRouter} = require("./route/user.route")
const {postRouter} = require("./route/Socialpost.route")
const { authenticate } = require("./middleware/auth.middleware")

const app = express()
const port = process.env.port

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.use("/users",userRouter)
app.use(authenticate)
app.use("/posts",postRouter)

app.listen(port,()=>{
    try{
        connection
        console.log("Server is running on port "+ port);
    }catch(err){
        console.log(err)
    }
})