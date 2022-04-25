import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String },
    countryCode: { type: Number },
    phoneNumber: { type: Number },
    conversation: [{
        conversationDate: { type: Date, required: true},
        messages: [{
            username: { type: String },
            message: { type: String, required: true },
            delete: { type: Boolean },
            role: { type: String },
            time: { type: Date, required: true}
        }]
    }],
    unread: { type: Number, default: 0 },
    userUnread: { type: Boolean, default: false}
},{
    timestamps: true,
})

const Message = mongoose.model("Message", messageSchema);

export default Message;