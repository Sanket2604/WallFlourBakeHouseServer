import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    preference: [ { type: String, required: true } ],
    typeOfDish: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: {type: String, required: true},
    rating: { type: Number, default: 5 },
    allergy: {type: String},
    customisation: { type: Boolean, default: false },
    batchSize: { type: String, required: true },
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ],
    deleted: { type: Boolean, default: false},
    unitsSold: { type: Number, default: 0 },
},{
    timestamps: true,
})

const Product = mongoose.model("Product", productSchema);

export default Product;

