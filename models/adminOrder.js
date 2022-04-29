import mongoose from 'mongoose'

const adminOrderSchema = mongoose.Schema({
    
    orderDate: { type: String, require: true},
    orderList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }]
    
},{
    timestamps: true
})

const AdminOrder = mongoose.model('AdminOrder', adminOrderSchema);
export default AdminOrder;