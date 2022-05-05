import User from '../models/user.js'
import Comment from '../models/comment.js'
import DP from '../models/displayPic.js'
import Order from '../models/order.js'
import Cart from '../models/cart.js'
import Message from '../models/messages.js'

export const allUserData = async(req, res) => {

    try{
        const allAdmin = await User.find({role: "admin"},{ dp:1, firstname: 1, lastname: 1, username: 1, countryCode: 1, phoneNumber: 1, email: 1 })
        const allCustomer = await User.find({role: "customer"},{ dp:1, firstname: 1, lastname: 1, username: 1, countryCode: 1, phoneNumber: 1, email: 1 })
        res.status(200).json({allAdmin, allCustomer})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const oneUserData = async(req, res) => {

    try{
        const oneUser = await User.findById(req.params.userId).populate('comments').populate('favourites')
        const userActiveOrders = await Order.find({username: oneUser.username})
        let activeOrders = userActiveOrders.filter(order=>{
            return order.status!=="Delivered"
        })
        res.status(200).json({oneUser, activeOrders})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteUserData = async(req, res) => {

    try{
        const oneUser = await User.findById(req.params.userId)
        if(oneUser.comments.length>0) return res.status(500).json({ message: 'Delete All Comments Posted By User'})
        const userActiveOrders = await Order.find({username: oneUser.username})
        let activeOrders = userActiveOrders.filter(order=>{
            return order.status!=="Delivered"
        })
        if(activeOrders.length>0) return res.status(500).json({ message: 'Delete All Active Orders of The User'})
        await User.findByIdAndDelete(req.params.userId)
        await Cart.findOneAndDelete({user: req.params.userId})
        await Message.findOneAndDelete({user: req.params.userId})
        res.status(200).json({ message: 'User Deleted' })
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const addDp = async (req,res) => {
    const body = req.body;
    try{
        await DP.create(body);
        res.status(200).json({ message: 'Display picture added' })
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const editDp = async (req,res) => {
    const body = req.body;
    try{
        const dpToEdit = await DP.findById(req.params.dpID)
        if(!dpToEdit) return res.status(404).json({ message: 'Cannot Find DP' })
        const users = await User.find({dp: dpToEdit.dp})
        const comments = await Comment.find({dp: dpToEdit.dp})
        users.map(user=>{
            user.dp=body.dp
            user.save()
        })
        comments.map(comment=>{
            comment.dp=body.dp
            comment.save()
        })
        await DP.findByIdAndUpdate(req.params.dpID, body, {new: true})
        res.status(200).json({ message: 'Display picture Updated' })
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

export const deleteDp = async (req,res) => {
    try{
        const dpToEdit = await DP.findById(req.params.dpID)
        if(!dpToEdit) return res.status(404).json({ message: 'Cannot Find DP' })
        const users = await User.find({dp: dpToEdit.dp})
        const comments = await Comment.find({dp: dpToEdit.dp})
        users.map(user=>{
            user.dp="https://i.ibb.co/QKVNtDz/fallbackpic.png"
            user.save()
        })
        comments.map(comment=>{
            comment.dp="https://i.ibb.co/QKVNtDz/fallbackpic.png"
            comment.save()
        })
        await DP.findByIdAndDelete(req.params.dpID)
        res.status(200).json({ message: 'Display picture Deleted' })
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}
