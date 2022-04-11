import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
    messages: [{
        username: { type: String },
        message: { type: String, required: true }
    }],
},{
    timestamps: true,
})

const Message = mongoose.model("Message", messageSchema);

export default Message;