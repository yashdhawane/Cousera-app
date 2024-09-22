const {Router} =require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRouter =Router();

const { userModel } = require("../db/db");
const { userAuthMiddleware } = require('../auth/userAuth'); // Import middleware


userRouter.post("/signup", async (req,res)=>{
    // res.json({
    //     message:"signup endpoint"
    // })
    try {
        const { email, password, firstName, lastName } = req.body;
    
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const newUser = new userModel({
          email,
          password: hashedPassword,
          firstName,
          lastName,
        });
    
        // Save the user to the database
        await newUser.save();
    
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
    
})

userRouter.post("/signin",async (req,res)=>{
    // res.json({
    //     message:"signin endpoint"
    // })
    try {
        const { email, password } = req.body;
    
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        // Generate JWT token
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          process.env.JWT_SECRET,
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

userRouter.get("/purchase",userAuthMiddleware, (req,res)=>{
    res.json({
        message:"purchase endpoint"
    })
})

module.exports={
    userRouter : userRouter
}