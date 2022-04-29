import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    username: {type: String, required: true},
    orderItems:[
        {
            productName: {type: String, required: true},
            productImage: {type: String, required: true},
            productPrice: {type: Number, required: true},
            discount: {type: Number, required: true},
            customisation: { type: String, default: "" },
            quantity:{ type: Number, default: 1 },
            total:{ type: Number, default: 0 }
        }
    ],
    orderCancel: {type: Boolean, default: false},
    deliveryDate: { type: String },
    couponCode: {type: String, default: "" },
    grandTotal: {
        type: Number,
        required: true
    },
    status: { type: String, default: "Order Pending Approval" },
    paymentStatus: { type: String, default: "Pending" },
    shippingAddress: {   
        name: {type: String, required: true },
        countryCode: {type: Number, default: 91},
        phoneNumber: {type: Number, required: true},
        address: { type: String , required: true },
        landmark: { type: String , required: true},
        city: { type: String , required: true},
        pincode: { type: String , required: true},
        state: { type: String, required: true}
    },
},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);
export default Order;