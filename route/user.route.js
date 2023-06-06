const express = require("express")

const { userModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt")
const userRouter = express.Router()

// get all the register user data ..................

userRouter.get("/", async (req, res) => {
    try {

        let user = await userModel.find();
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})


// register a new user ===================

userRouter.post("/register", async (req, res) => {
    let userData = req.body;
    console.log({ userData })
    try {

        let user = await userModel.find({ email: userData.email });
        if (user.length > 0) {
            res.status(404).send("user already Exist")

        } else {
            bcrypt.hash(userData.password, 5, async (err, hash) => {
                if (hash) {
                    userData.password = hash;
                    const newUser = new userModel(userData)
                    await newUser.save()
                    res.status(201).send("user Register successfully ")
                }
            })
        }

    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})

// login users from here=====================================

userRouter.post("/login", async (req, res) => {
    const { email, password } = (req.body)
    try {
        
        const user = await userModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    let token = jwt.sign({ userID:user[0]._id }, "masai")
                    res.status(201).send({ "msg": "Logged in successfull", "token": token })
                }else{
                    res.send({ "msg": "Wrong Creditals" })
                }

            })

        }
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
    // res.send({ "msg": "Logged in successfull" })

})




// get all friends of particulalkar user==================
userRouter.get("/:id/friends", async (req, res) => {
    let id = req.params.id;

    try {
        let user = await userModel.findById(id)
        let friends = user.friends;
        console.log(user)
        res.status(201).send({ friends, user })
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})


// sending friends requiest========================

userRouter.post("/:id/friends/", async (req, res) => {
    let id = req.params.id;// id of user
    let friendsId = req.body.userId

    console.log(friendsId)
    try {
        // gettting the usr=============
        let user = await userModel.findById(id);
        user.friendRequest.push(friendsId)

        console.log(user)

        await user.save()
        res.status(201).send("friend request send here")
    } catch (err) {

        res.status(404).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})


////////////////////////////////////////////////////////////////

userRouter.patch("/:id/friends/:friendId", async (req, res) => {
    let id = req.params.id;

    let friendId = req.params.friendId
    try {
        let user = await userModel.findById(id);
        if (user.friendRequest.includes(friendId)) {
            user.friends.push(friendId)
        } else {
            res.send("No Request Found herer")
        }

        console.log(user)

        await user.save()

        res.status(201).send("Frien request  update ")
    } catch (err) {

        res.status(404).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})



module.exports ={
    userRouter
}