import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    categoryName: { type: String, required: true },
    categoryProducts: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } ],
    deleted: { type: Boolean, default: false},
},{
    timestamps: true,
})

const Category = mongoose.model("Category", categorySchema);

export default Category;