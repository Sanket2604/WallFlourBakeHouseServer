import Cart from '../models/cart.js'
import Order from '../models/order.js'
import Product from '../models/product.js'

export const getAllOrders = async(req, res) => {

    try{
        const orders = await Order.find({user: req.userId}).populate({ 
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        let activeOrders = orders.filter(order=>{
            return order.status!=="Delivered"
        })
        let completedOrders = orders.filter(order=>{
            return order.status==="Delivered"
        })
        res.status(200).json({activeOrders, completedOrders})
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
        console.log(error)
    }
}
export const addUserOrder = async (req, res) => {

    const body=req.body
    try{
        const cart = await Cart.findOne({user: req.userId})
        if(!cart) return res.status(403).json({ message: 'Can not place order'})
        if(cart.cartItems.length<1) return res.status(400).json({ message: 'Cart is Empty!'})
        Order.create({
            user: cart.user,
            orderItems: cart.cartItems,
            grandTotal: cart.grandTotal,
            discount: cart.discount,
            shippingAddress: body.shippingAddress
        })
        await Promise.all(cart.cartItems.map(async item => {
            try{
                const product = await Product.findById(item.product)
                product.unitsSold+=item.quantity
                product.save()
            }
            catch(error){
                console.log(error)
            }
        }))
        cart.cartItems=[]
        cart.save()
        res.status(200).json({message: "Order Placed Successfully"})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}
