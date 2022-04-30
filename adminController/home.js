import Order from '../models/order.js'
import AdminOrder from '../models/adminOrder.js'
import Comment from '../models/comment.js'
import User from '../models/user.js'
import OrderControl from '../models/order_control.js'
import moment from 'moment'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        if(existingUser.role!=='admin') return res.status(403).json({ message: "Access Denied" })
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credential" })
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'AWorldFullOfLove', { expiresIn: 2189229120000})
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const homeDashboard = async(req, res) => {
    let today=moment().format('DD/MM/YYYY')

    try{
        const orders = await Order.find({}).populate('user')
        const todayDelivery = await Order.find({deliveryDate: today}).populate('user')
        const todayOrders = await AdminOrder.findOne({orderDate: today}).populate('orderList')
        let todayOrderList
        if(todayOrders){
            todayOrderList=todayOrders.orderList
        }
        else{
            todayOrderList=[]
        }
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
            todayDelivery,
            todayOrders: todayOrderList,
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