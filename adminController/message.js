import Message from "../models/messages.js"
import User from '../models/user.js'
import moment from 'moment'
import OrderControl from '../models/order_control.js'

export const allUserChats = async(req, res) => {

    try{
        const allChats = await Message.find({}).populate('user').sort({updatedAt: -1})
        const orderControl = await OrderControl.findOne({})
        const knownChat = allChats.filter(chat=>{
            return chat.user
        })
        const unknownChat = allChats.filter(chat=>{
            return !chat.user
        })
        res.status(200).json({knownChat, unknownChat, unknownUserMessageCount: orderControl.unknownUserMessageCount})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const resetUnknownUserMessageCount = async(req, res) => {
    try{
        const orderControl = await OrderControl.findOne({})
        orderControl.unknownUserMessageCount=0
        orderControl.save()
        res.status(200).json({ message: 'Unknown User Message Count Updated'})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const viewUserMessages = async(req, res) => {

    try{
        const userChat = await Message.findById(req.body.id).populate('user')
        userChat.unread=0
        userChat.save()
        res.status(200).json(userChat)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const adminSendMessage = async (req,res) => {
    const body = req.body;
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const conversations = await Message.findById(body.id);
        if(!conversations) return res.status(404).json({ message: "Can Not Find User Chat" })

        let flag=0
        conversations.conversation.map((conv)=>{
            if(moment(conv.conversationDate).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")){
                conv.messages.push({
                    username: existingUser.username,
                    message: body.message,
                    role: "admin",
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
                    role: "admin",
                    time:  new Date(),
                }]
            })
        }
        if(!conversations.userUnread) conversations.userUnread=true
        conversations.save()
        res.status(200).json(conversations)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const deleteStrangerMessage = async(req, res) => {

    try{
        await Message.findByIdAndDelete(req.params.msgId)
        res.status(200).json({ message: 'Message Successfully Deleted'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}