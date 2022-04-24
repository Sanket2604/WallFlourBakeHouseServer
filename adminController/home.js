import Order from '../models/order.js'
import Comment from '../models/comment.js'
import User from '../models/user.js'
import OrderControl from '../models/order_control.js'
import moment from 'moment'

export const homeDashboard = async(req, res) => {
    try{
        const orders = await Order.find({}).populate('user').populate({ 
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        const currentMonthOrders = orders.filter((order)=>{
            return moment().format('MM')===moment(order.createdAt, 'YYYY/MM/DD').format('MM')
        })
        let activeOrders = orders.filter(order=>{
            return order.status!=="Delivered"
        })
        let totalSales=0
        for(let i=0; i<currentMonthOrders.length; i++){
            totalSales+=currentMonthOrders[i].grandTotal
        }
        const orderControl = await OrderControl.findOne({})

        const comments = await Comment.find({})
        const currentMonthComments = comments.filter((comment)=>{
            return moment().format('MM')===moment(comment.createdAt, 'YYYY/MM/DD').format('MM')
        })
        
        const users = await User.find({})
        const currentMonthUsers = users.filter((user)=>{
            let difference=moment().diff(moment(user.createdAt), 'days')
            return difference<7
        })
        
        res.status(200).json({
            activeOrders, 
            orderControl,
            newUsers : currentMonthUsers,
            dashBoard: {
                totalSales,
                monthSales: currentMonthOrders.length,
                monthComments: currentMonthComments.length
            },
        })
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const changeOrderControl = async(req, res) => {

    try{
        const orderControl = await OrderControl.find()
        orderControl[0].status=!orderControl[0].status
        await orderControl[0].save()
        res.status(200).json({ message: "Order Control Updated"})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}