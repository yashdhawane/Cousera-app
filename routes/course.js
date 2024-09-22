const {Router} =require("express")

const courseRouter =Router();
const { courseModel } = require("../db/db");


courseRouter.post("/purchase", (req,res)=>{
    res.json({
        message:"signup endpoint"
    })
})

courseRouter.get("/preview", (req,res)=>{
    res.json({
        message:"signup endpoint"
    })
})

module.exports={
    courseRouter : courseRouter
}
