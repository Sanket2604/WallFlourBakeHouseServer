import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    user: { type: String, required: true },
    productName: {type: String, required: true},
    rating: { type: Number, required: true },
    comment: {type: String, required: true},
    dp: {type: String, required: true}
},{
    timestamps: true,
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;