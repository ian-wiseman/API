import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoData from './mongoData.js'

// app config
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json);

// db config
const MongoURI = '';

mongoose.connect(MongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('DB Connected');

})


// api routes
app.get('/', (req, res) => res.status(200).send('Welcome to Teale Chat'));

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

app.get('/get/channelList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.send(500).send(err);
        } else {
            let channels = [];
            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo);
            })

            res.status(200).send(channels);
        }
    })
})

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

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
