import mongoose from 'mongoose';

const orderControlSchema = mongoose.Schema({
    status: { type: Boolean },
    unknownUserMessageCount: { type: Number }
},{
    timestamps: true,
})

const OrderControl = mongoose.model("OrderControl", orderControlSchema);

export default OrderControl;