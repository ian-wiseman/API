import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

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


// Validation

const joi = require('@hapi/joi');

const schema = {
       name: joi.string().min(6).required(),
       email: joi.string().min(6).required().email(),
       password: joi.string().min(6).required()
       

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
       const { error } = joi.validate(req.body, schema);
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
       

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
