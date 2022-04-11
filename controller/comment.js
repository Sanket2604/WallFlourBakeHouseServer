import Products from '../models/product.js'
import Comment from '../models/comment.js';
import User from '../models/user.js'
import DP from '../models/displayPic.js';

export const getComment = async (req, res) => {

    try{
        const existingUser = await User.findOne({ _id: req.userId }).populate('comments')
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        res.status(200).json(existingUser.comments)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const postComment = async (req, res) => {
    const body  = req.body;
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const product = await Products.findOne({ productName: body.productName })
        if(!product) return res.status(404).json({ message: "Product doesn't exist" })
        product.rating=((parseFloat(product.rating)*parseFloat(product.comments.length))+parseFloat(body.rating))/(parseFloat(product.comments.length+1))
        product.rating=product.rating.toFixed(1)
        const comment = await Comment.create({
            user: existingUser.username,
            productName: body.productName,
            rating: body.rating,
            comment: body.comment,
            dp: existingUser.dp,
        })
        product.comments.unshift(comment._id)
        existingUser.comments.unshift(comment._id)
        existingUser.save()
        product.save()
        res.status(200).json({ message: 'Comment Added Successfully' })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const updateComment = async (req, res) => {
    const body  = req.body;
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const comment = await Comment.findById(req.params.commentId)
        if(comment.user!==existingUser.username) return res.status(403).json({ message: "Can Not Change Other's Comments" })
        const rating=comment.rating
        const product = await Products.findOne({ productName: body.productName })
        product.rating=((parseFloat(product.rating)*(parseFloat(product.comments.length)+1))-parseFloat(rating))/parseFloat(product.comments.length)
        product.rating=((parseFloat(product.rating)*parseFloat(product.comments.length))+parseFloat(body.rating))/(parseFloat(product.comments.length+1))
        product.rating=product.rating.toFixed(1)
        await Comment.findByIdAndUpdate(req.params.commentId, {
            user: existingUser.username,
            productName: body.productName,
            rating: body.rating,
            comment: body.comment,
            dp: existingUser.dp,
        })
        product.save()
        res.status(200).json({ message: 'Comment Edited Successfully' })
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const commentToDelete = await Comment.findById(commentId);
        if(!commentToDelete) return res.status(404).json({ message: "Comment doesn't exist" })
        if(existingUser.username!==commentToDelete.user) return res.status(403).json({ message: "Can Not Delete Other's Comments" })
        const product = await Products.findOne({ productName: req.body.productName })
        if(!product) return res.status(404).json({ message: "Product doesn't exist" })

        const rating = commentToDelete.rating
        let position
        existingUser.comments.map((comment, index)=>{
            if(comment.toString()===commentId){
                position=index
            }
        })
        existingUser.comments.splice(position,1)
        existingUser.save()
        
        product.comments.map((comment, index)=>{
            if(comment.toString()===commentId){
                position=index
            }
        })
        if(product.comments.length>1) {
            product.rating=((parseFloat(product.rating)*(parseFloat(product.comments.length)+1))-parseFloat(rating))/parseFloat(product.comments.length)
        } else {
            product.rating=5
        }
        if(product.rating>5||product.rating<0){
            product.rating=5
        }
        product.rating=product.rating.toFixed(1)
        product.comments.splice(position,1)
        product.save()
        await Comment.findByIdAndDelete(commentId)
        res.status(200).json({ message: 'Comment Deleted Successfully' })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}