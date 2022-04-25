import moment from 'moment';
import Message from '../models/messages.js'
import User from '../models/user.js'

export const getUserMessage = async (req,res) => {
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        let conversations = await Message.findOne({user: existingUser._id});
        if(!conversations){
            conversations = await Message.create({
                user: existingUser._id,
                conversation: []
            })
        }
        if(conversations.userUnread) conversations.userUnread=false
        conversations.save()
        res.status(200).json(conversations)
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const strangerSendMessage = async (req,res) => {
    const body = req.body;
    try{
        await Message.create({
            name: body.name,
            email: body.email,
            countryCode: body.countryCode,
            phoneNumber: body.phoneNumber,
            conversation: [{
                conversationDate: new Date(),
                messages:[{
                    message: body.message,
                    role: "stranger",
                    time:  new Date(),
                }]
            }]
        })
        res.status(200).json({ message: 'Message Sent' })
    }catch(error){
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const userSendMessage = async (req,res) => {
    const body = req.body;
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const conversations = await Message.findOne({userId: existingUser._id});
        if(!conversations) return res.status(404).json({ message: "Can Not Find User Chat" })
        let flag=0
        conversations.conversation.map((conv)=>{
            if(moment(conv.conversationDate).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")){
                conv.messages.push({
                    username: existingUser.username,
                    message: body.message,
                    role: "customer",
                    time:  new Date()
                })
                flag=1
            }
        })
        if(flag===0){
            conversations.conversation.push({
                conversationDate: new Date(),
                messages: [{
                    username: existingUser.username,
                    message: body.message,
                    role: "customer",
                    time:  new Date(),
                }]
            })
        }
        conversations.unread++
        conversations.save()
        res.status(200).json(conversations)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}
