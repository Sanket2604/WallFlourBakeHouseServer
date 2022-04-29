import Cart from '../models/cart.js'
import Order from '../models/order.js'
import Product from '../models/product.js'
import AdminOrder from '../models/adminOrder.js'
import moment from 'moment'

export const getActiveOrders = async(req, res) => {

    try{
        const orders = await Order.find({})
        let activeOrders = orders.filter(order=>{
            return order.status!=="Delivered"
        })
        const allDatesOrders = await AdminOrder.find({}).populate('orderList')
        const dateWiseOrders = allDatesOrders.filter((order)=>{
            const orderDate = moment(order.orderDate, 'YYYY-MM-DD')
            let difference=moment().diff(moment(orderDate), 'days')
            return difference<7
        })
        res.status(200).json({activeOrders, dateWiseOrders})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getOneOrder = async(req, res) => {

    try{
        const order = await Order.findById(req.params.orderId).populate('user').populate({ 
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        res.status(200).json(order)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const updateStatus = async(req, res) => {

    try{
        const order = await Order.findById(req.params.orderId)
        order.status=req.body.status
        if(req.body.status==='Delivered'){
            order.deliveryDate=moment().format("DD/MM/YYYY")
        }
        order.save()
        res.status(200).json({ message: 'Order Status Updated'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const updatePayment = async(req, res) => {

    try{
        const order = await Order.findById(req.params.orderId)
        order.paymentStatus=req.body.payment
        order.save()
        res.status(200).json({ message: 'Order Payment Updated'})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getDateOrders = async(req, res) => {

    try{
        const date=moment(req.params.date).format("DD/MM/YYYY")
        const order = await AdminOrder.findOne({orderDate: date}).populate('orderList')
        res.status(200).json(order)
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getDeliveredOrders = async(req, res) => {

    try{
        const date=moment(req.params.date).format("DD/MM/YYYY")
        const order = await Order.find({deliveryDate: date, status: "Delivered"})
        res.status(200).json(order)
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const orderDelete = async(req, res) => {

    try{
        const order = await Order.findById(req.params.orderId).populate('orderList')
        await Promise.all(order.orderList.map(async item => {
            try{
                const product = await Product.findById(item.product)
                product.unitsSold-=item.quantity
                product.save()
            }
            catch(error){
                return res.status(500).json({ message: 'Something went wrong'})
            }
        }))
        await Order.findByIdAndDelete(req.params.orderId)
        res.status(200).json({ message: 'Order Deleted'})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const orderRestore = async(req, res) => {

    try{
        const order = await Order.findById(req.params.orderId)
        order.orderCancel=false
        order.save()
        res.status(200).json({ message: 'Order Restored'})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}