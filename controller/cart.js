import Products from '../models/product.js'
import User from '../models/user.js'
import Cart from '../models/cart.js'

export const getCart = async (req, res) => {

    try{
        const existingUser = await User.findOne({ _id: req.userId }).populate('comments')
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const cart = await Cart.findOne({user: req.userId}).populate({ 
            path: 'cartItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        if(!cart){
            const newCart = await Cart.create({ user: existingUser._id, cartItems:[], grandTotal: 0})
            res.status(200).json(newCart)
        }
        else{
            cart.cartItems.map((item, i)=>{
                if(item.product.deleted){
                    cart.cartItems.splice(i,1)
                }
            })
            let grandTotal=0
            cart.cartItems.map(item=>{
                grandTotal+=item.total
            })
            cart.grandTotal=grandTotal
            cart.save()
            res.status(200).json(cart)
        }
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const addItemToCart = async (req,res) => {

    const body = req.body
    try{
        const existingUser = await User.findOne({ _id: req.userId })
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const cart = await Cart.findOne({user: req.userId})
        const product = await Products.findById(body.productId)
        if(!product) return res.status(404).json({ message: "Product doesn't exist" })
        if(product.deleted) return res.status(400).json({ message: "The requested product has been deleted" })
        if(body.quantity>5 && body.quantity<1) return res.status(400).json({ message: "Invalid Quantity" })
        let total = (product.price-(product.price*product.discount*0.01))*body.quantity
        if(!cart){
            const newCart = await Cart.create({ user: existingUser._id, cartItems: [{ product: body.productId, quantity: body.quantity, total: total }], grandTotal: total})
            res.status(200).json(newCart)
        }
        else{
            cart.cartItems.map((item, i)=>{
                if(item.product.toString()===body.productId.toString()){
                    cart.cartItems.splice(i,1)
                    cart.grandTotal-=item.total
                }
            })
            let newProduct = {
                product: body.productId, 
                customisation: body.customisation,
                quantity: body.quantity, 
                preOrder: body.preOrder,
                total: total
            }
            cart.cartItems.unshift(newProduct)
            cart.grandTotal+=total
            cart.save()
            res.status(200).json({ "message": "Cart Updated" })
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteItemFromCart = async (req,res) => {

    const body = req.body
    try{
        const existingUser = await User.findOne({ _id: req.userId })
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const cart = await Cart.findOne({user: req.userId})
        const product = await Products.findById(body.productId)
        if(!product) return res.status(404).json({ message: "Product doesn't exist" })
        let total = (product.price-(product.price*product.discount*0.01))*body.quantity
        if(!cart){
            res.status(500).json("Cart not found")
        }
        else{
            cart.cartItems.map((item, i)=>{
                if(item.product.toString()===body.productId.toString()){
                    cart.cartItems.splice(i,1)
                }
            })
            cart.grandTotal-=total
            cart.save()
        }
        res.status(200).json({ "message": "Deleted from Cart" })

    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Someqthing went wrong'})
    }
}