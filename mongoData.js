import mongoose from 'mongoose';

const conversationSchema = mongoose.Schema({
    channelName: String,
    conversation: [
        {
            message: String,
            timeStamp: String,
            userName: String
        }
    ]
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5
    },
    email: {
        type: String,
        required: true,
        min: 7
    }
});

export default mongoose.model('conversations', conversationSchema)
export default mongoose.model('user', userSchema)
