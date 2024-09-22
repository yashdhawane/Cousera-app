const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin'); // Import the admin router






dotenv.config();
const app = express();
// Add body-parsing middleware
app.use(express.json());

app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/admin', adminRouter); // Add the admin routes

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to the database');
    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}

main();
