const {Router} =require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRouter =Router();
const { adminModel,courseModel } = require("../db/db");
const { adminAuthMiddleware } = require('../auth/adminAuth'); 

adminRouter.post("/signup", async function(req, res) {
    // res.json({
    //     message: "signup endpoint"
    // })
    try {
        const { email, password, firstName, lastName } = req.body;
    
        // Check if the admin already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
          return res.status(400).json({ message: 'Admin already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new admin
        const newAdmin = new adminModel({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
    
        // Save the admin to the database
        await newAdmin.save();
    
        res.status(201).json({ message: 'admin registered successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
})

adminRouter.post("/signin", async function(req, res) {
    // res.json({
    //     message: "signup endpoint"
    // })

    try {
        const { email, password } = req.body;
    
        // Check if the user exists
        const admin = await adminModel.findOne({ email });
        if (!admin) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }``
    
        // Generate JWT token
        const token = jwt.sign(
          {
            id: admin._id,
          
          },
          process.env.ADMIN_JWT_SECRET,
          { expiresIn: '1h' } // Token expires in 1 hour
        );
    
        res.status(200).json({
          message: 'Signin successful',
          token,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})

adminRouter.post("/course",adminAuthMiddleware, async function(req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  const course = await courseModel.create({
    title: title, 
    description: description, 
    imageUrl: imageUrl, 
    price: price, 
    creatorId: adminId
})
    res.json({
        message: "admin created course ",
        courseId: course._id
    })
})

adminRouter.put("/course", adminAuthMiddleware, async function(req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price, courseId } = req.body;
    

    const course = await courseModel.updateOne({
      _id: courseId, 
      creatorId: adminId 
  }, {
      title: title, 
      description: description, 
      imageUrl: imageUrl, 
      price: price
  })
  res.json({
    message: "course updated",
    courseId:course._Id
})
})

adminRouter.get("/course/bulk", adminAuthMiddleware,  async function(req, res) {
  const adminId = req.userId;

  const courses = await courseModel.find({
      creatorId: adminId 
  });

  res.json({
      message: "Course updated",
      courses
  })
})

module.exports={
    adminRouter : adminRouter
}