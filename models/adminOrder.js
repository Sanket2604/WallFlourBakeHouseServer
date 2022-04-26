import mongoose from 'mongoose'

const adminOrderSchema = mongoose.Schema({
    
    orserDate: { type: Date, require: true},
    orderList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }]
    
},{
    timestamps: true
})

const adminOrder = mongoose.model('AdminOrder', adminOrderSchema);
export default adminOrder;