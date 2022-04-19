import mongoose from 'mongoose';

const orderControlSchema = mongoose.Schema({
    status: { type: Boolean, default: true },
},{
    timestamps: true,
})

const OrderControl = mongoose.model("OrderControl", orderControlSchema);

export default OrderControl;