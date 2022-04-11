import mongoose from 'mongoose'

const cartSchema = mongoose.Schema({
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cartItems:[
        {
            product:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            customisation: { type: String, default: "" },
            quantity: { type: Number, default: 1 },
            preOrder: { type: String },
            total:{ type: Number, default: 0 }
        }
    ],
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 }
},{
    timestamps: true
})

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;