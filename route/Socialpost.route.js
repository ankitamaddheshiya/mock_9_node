const express = require("express")

const { postModel } = require("../model/socialMediaPost.model")

const postRouter = express.Router()


// get all the registered users=======================

postRouter.get("/", async (req, res) => {
    try {

        let data = await postModel.find()
        res.status(200).send(data)
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})



// register a new users =============================


postRouter.post("/", async (req, res) => {
    let postData = req.body;
    console.log({ postData })

    try {
        let newpost = new postModel(postData);
        await newpost.save()

        res.status(201).send("post created successfully")
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})




// update a post by id==========================

postRouter.patch("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        await postModel.findByIdAndUpdate(id, req.body);
        res.status(204).send("post updated Successfully.............")
    } catch(err){
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})

postRouter.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {

        let postData = await postModel.findById(id)
        res.status(200).send(postData)

    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})



/// deleted  a post by id=====================================


postRouter.delete("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        await postModel.findByIdAndDelete(id);
        res.status(202).send("post deleted Successfully...................")
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})


// like a particular post=========================================

postRouter.post("/:id/like", async (req, res) => {
    let id = req.params.id;
    let userId = req.body.userId;
    try {
        let postData = await postModel.findById(id)
        postData.likes.push(userId)
        await postData.save()
        res.status(202).send("Post likes...................")
    } catch (err) {
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})


///add the comments from here-----------------------------


postRouter.post("/:id/comment",async(req,res)=>{
    let id = req.params.id;
    try{

        let postData = await postModel.findById(id)
        postData.comments.push(req.body)
        await postData.save()

        res.status(202).send("comment added successfully.........................")

    }catch(err){
        res.status(400).send({ "msg": "Something Went wrong ", "error": err.message })
    }
})


module.exports ={
    postRouter
}