import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
const { registerValidation, loginValidation } = require('/validation');

import mongoData from './mongoData.js';
require('dotenv/config');

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json();

// DB config

mongoose.connect(
       process.env.mongoConnection, { useNewUrlParser: true}, () => 
        console.log('DB Connected');
)

// API routes

//Create new Channel
app.post('/new/channel', (req, res) => {
    const dbData = req.body;

    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

// Create a new message
app.post('/new/message', (req, res) => {
    const id = req.query.id;
    const newMessage = req.body;

    mongoData.update(
        { _id: id },
        { $push: { conversation: newMessage }},
    (err, data) => {
        if (err) {
            res.send(500).send(err);
        } else {
            res.send(201).send(data);
        }
    })    
    
})

// Get conversation
app.get('/get/conversation', (req, res) => {
    const id = req.query.id;

    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})

// Register new user
app.post('/register', async (req, res) => {
    
       // Validate first
       const { error } = registerValidation(req.body);
       if (error) return res.status(400).send(error.details[0].message);
       
       // Check if user already exists
       const emailExists = await User.findOne({email: req.body.email});
       const userNameExists = await User.findOne({email: req.body.userName});
       if (emailExists || userNameExists) return res.status(400).send('User already exists');
       
       // Hash passwords
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(req.body.password, salt);
              
       // Create new user variable
       const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: hashedPassword
       });
       try {
              const savedUser = await user.save();
              res.status(200).send(savedUser);
       } catch(err) {
              res.status(400).send(err);
});

// Login
app.post('/login', (req, res) => {
       
       // Validate first
       const { error } = loginValidation(req.body);
       if (error) return res.status(400).send(error.details[0].message);
       
       // Check if email exists
       const emailExists = await User.findOne({email: req.body.email});
       if (!emailExists) return res.status(400).send('Email not found');
       
       
       // Validate password
       const validPassword = await bcrypt.compare(req.body.password, user.password);
       if (!validPassword) return res.status(400).send('Invalid password');
       

// Listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
