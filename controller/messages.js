import Message from '../models/messages.js'
import User from '../models/user.js'

export const getUserMessage = async (req,res) => {
    const body = req.body;
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const conversation = await Message.findOne({userId: existingUser._id});
        res.status(200).json(conversation)
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }

}
export const strangerSendMessage = async (req,res) => {
    const body = req.body;
    console.log(body)
    try{
        const msg = await Message.create({
            name: body.name,
            email: body.email,
            countryCode: body.countryCode,
            phoneNumber: body.phoneNumber,
            messages: [{
                message: body.message
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
        const conversation = await Message.findOne({userId: existingUser._id});
        conversation.messages.push({
            username: existingUser.username,
            message: body.message
        })
        conversation.save()
        res.status(200).json(conversation)
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}
