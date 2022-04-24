import Comment from '../models/comment.js'
import User from '../models/user.js'
import Product from '../models/product.js'

export const recentComments = async(req, res) => {

    try{
        const newComments = await Comment.find({}).sort({createdAt: -1}).limit(30)
        res.status(200).json(newComments)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteComments = async(req, res) => {

    const commentId = req.params.commentId
    try{
        const comment = await Comment.findById(commentId)
        if(!comment) return res.status(200).json({ message: 'Comment Does Not Exist'})
        const user = await User.findOne({username: comment.user})
        if(!user) return res.status(200).json({ message: 'User Miss Match Only Sanket Can Solve This'})
        const product = await Product.findOne({productName: comment.productName})
        if(!product) return res.status(200).json({ message: 'Product Miss Match Only Sanket Can Solve This'})
        user.comments.map((comment, i)=>{
            if(comment.toString()===commentId.toString()){
                user.comments.splice(i,1)
            }
        })
        user.save()
        product.comments.filter((comment, i)=>{
            if(comment.toString()===commentId.toString()){
                product.comments.splice(i,1)
            }
        })
        product.save()
        await Comment.findByIdAndDelete(commentId)
        res.status(200).json({ message: 'Comment Deleted!'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}