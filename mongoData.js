import mongoose from 'mongoose';

const slackSchema = mongoose.Schema({
    channelName: String,
    conversation: [
        {
            message: String,
            timeStamp: String,
            user: String,
            userImage: String
        }
    ]
})

export default mongoose.model('conversations', slackSchema)