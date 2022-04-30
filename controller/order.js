import Cart from '../models/cart.js'
import Order from '../models/order.js'
import AdminOrder from '../models/adminOrder.js'
import Product from '../models/product.js'
import User from '../models/user.js'
import moment from 'moment'

export const getAllOrders = async(req, res) => {

    try{
        const orders = await Order.find({user: req.userId})
        let activeOrders = orders.filter(order=>{
            return order.status!=="Delivered"
        })
        let completedOrders = orders.filter(order=>{
            return order.status==="Delivered"
        })
        res.status(200).json({activeOrders, completedOrders})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getOneOrder = async(req, res) => {

    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const order = await Order.findById(req.params.orderId).populate('user')
        if(existingUser._id.toString()!==order.user._id.toString()) return res.status(403).json({ message: "Can Not Access Others Orders" })
        res.status(200).json(order)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const orderCancelation = async(req, res) => {

    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const order = await Order.findById(req.params.orderId).populate('user')
        if(existingUser._id.toString()!==order.user._id.toString()) return res.status(403).json({ message: "Can Not Access Others Orders" })
        order.orderCancel=true
        order.save()
        res.status(200).json(order)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}


export const orderRestore = async(req, res) => {

    try{
        const existingUser = await User.findById(req.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const order = await Order.findById(req.params.orderId).populate('user')
        if(existingUser._id.toString()!==order.user._id.toString()) return res.status(403).json({ message: "Can Not Access Others Orders" })
        order.orderCancel=false
        order.save()
        res.status(200).json({ message: 'Order Restored'})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const addUserOrder = async (req, res) => {

    const body=req.body
    let today=moment().format('DD/MM/YYYY')
    try{
        const presentOrder = await AdminOrder.findOne({orderDate: today})
        if(!presentOrder){
            await AdminOrder.create({
                orderDate: today,
                orderList: []
            })
        }
        const cart = await Cart.findOne({user: req.userId}).populate('user').populate({ 
            path: 'cartItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        let cartItems=[]
        cart.cartItems.map(cartItem=>{
            cartItems.push({
                productName: cartItem.product.productName,
                productImage: cartItem.product.image,
                productPrice: cartItem.product.price,
                preOrder: cartItem.preOrder,
                discount: cartItem.product.discount,
                customisation: cartItem.customisation,
                quantity: cartItem.quantity,
                total: cartItem.total
            })
        })
        if(!cart) return res.status(403).json({ message: 'Can not place order'})
        if(cart.cartItems.length<1) return res.status(400).json({ message: 'Cart is Empty!'})
        if(cartItems.length===1){
            const newOrder = await Order.create({
                user: cart.user,
                username: cart.user.username,
                orderItems: cartItems,
                grandTotal: cart.grandTotal,
                discount: cart.discount,
                deliveryDate: cart.cartItems[0].preOrder,
                shippingAddress: body.shippingAddress
            })
            const adminOrderGroup = await AdminOrder.findOne({orderDate: today})
            adminOrderGroup.orderList.push(newOrder._id)
            adminOrderGroup.save()
        }
        else{
            let orderStack=[]
            cartItems.map(cartItem=>{
                let pos=-1
                orderStack.map((order,position)=>{
                    if(cartItem.preOrder===order.deliveryDate){
                        pos=position
                    }
                })
                if(pos!==-1){
                    orderStack[pos].products.push({
                        productName: cartItem.productName,
                        productImage: cartItem.productImage,
                        productPrice: cartItem.productPrice,
                        discount: cartItem.discount,
                        customisation: cartItem.customisation,
                        quantity: cartItem.quantity,
                        total: cartItem.total,
                    })
                    orderStack[pos].grandTotal+=cartItem.total
                }
                else{
                    orderStack.push({
                        deliveryDate: cartItem.preOrder,
                        products: [{
                            productName: cartItem.productName,
                            productImage: cartItem.productImage,
                            productPrice: cartItem.productPrice,
                            discount: cartItem.discount,
                            customisation: cartItem.customisation,
                            quantity: cartItem.quantity,
                            total: cartItem.total,
                        }],
                        grandTotal: cartItem.total
                    })
                }
            })
            await Promise.all(orderStack.map( async order=>{
                try{
                    const newOrder = await Order.create({
                        user: cart.user,
                        username: cart.user.username,
                        orderItems: order.products,
                        grandTotal: order.grandTotal,
                        discount: cart.discount,
                        deliveryDate: order.deliveryDate,
                        shippingAddress: body.shippingAddress
                    })
                    const adminOrderGroup = await AdminOrder.findOne({orderDate: today})
                    adminOrderGroup.orderList.push(newOrder._id)
                    adminOrderGroup.save()
                } catch(error){
                    console.log(error)
                    return res.status(500).json({ message: 'Something went wrong'})
                }
            }))
        }
        await Promise.all(cart.cartItems.map(async item => {
            try{
                const product = await Product.findById(item.product)
                product.unitsSold+=item.quantity
                product.save()
            }
            catch(error){
                console.log(error)
                return res.status(500).json({ message: 'Something went wrong'})
            }
        }))
        cart.cartItems=[]
        cart.save()
        res.status(200).json({message: "Order Placed Successfully"})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}