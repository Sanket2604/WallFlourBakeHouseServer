import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import User from '../models/user.js'
import DP from '../models/displayPic.js'
import Comment from '../models/comment.js'
import Product from '../models/product.js'
import Message from '../models/messages.js'

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credential" })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'AWorldFullOfLove', { expiresIn: 2189229120000})

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const signup = async (req, res) => {
    const { firstname, lastname, username, email, password, rePassword, countryCode, phoneNumber, gender, dob, billingAddress, landmark, city, pincode, state, preference } = req.body;
    const usernamePattern = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
    const countryPattern = /^\d{1,3}$/
    const phonePattern = /^\d{10}$/
    const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

    try{
        if(!usernamePattern.test(username)) return res.status(400).json({ message: "Invalid Username" })
        if(!emailPattern.test(email)) return res.status(400).json({ message: "Invalid Email" })
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ message: "Username already exists" })
        if(existingEmail) return res.status(400).json({ message: "Email Id already exists" })
        if(password.length<6) return res.status(400).json({ message: "Password should be greater than 6 charecters." })
        if(password !== rePassword) return res.status(400).json({ message: "Passwords don't match." })
        if(!countryPattern.test(countryCode))  return res.status(400).json({ message: "Invalid Country Code" })
        if(!phonePattern.test(phoneNumber)) return res.status(400).json({ message: "Invalid Phone Number" })
        if(gender!=='Male'&&gender!=='Female'&&gender!=='Secret') return res.status(400).json({ message: "Incorrect Gender" })
        let difference=moment().diff(moment(dob), 'years')
        if(difference<4 || difference>140) return res.status(400).json({ message: "Incorrect Date of Birth" })
        let dp
        if(gender==="Male"){
            dp = "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"
        }
        else if(gender==='Female'){
            dp = "https://services.tochat.be/icon/femaleprofileicon6-5fcc843c87715.png"
        }
        else{
            dp = "https://avatars.githubusercontent.com/u/35440139?v=4"
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        let new_user
        if(city==='Bangalore'&&state==='Karnataka'){
            new_user = { 
                firstname, 
                lastname, 
                username, 
                email, 
                password: hashedPassword, 
                countryCode, 
                phoneNumber, 
                gender, 
                dob, 
                dp,
                billingAddress: { 
                    address: billingAddress, 
                    landmark: landmark, 
                    city: city, 
                    pincode: pincode,
                    state: state,
                },
                shippingAddress:[{
                    name: firstname+" "+lastname,
                    countryCode: countryCode,
                    phoneNumber: phoneNumber,
                    address: billingAddress, 
                    landmark: landmark, 
                    city: city, 
                    pincode: pincode,
                    state: state,
                }],
                preference
            }
        }
        else{
            new_user = { 
                firstname, 
                lastname, 
                username, 
                email, 
                password: hashedPassword, 
                countryCode, 
                phoneNumber, 
                gender, 
                dob, 
                dp,
                billingAddress: { 
                    address: billingAddress, 
                    landmark: landmark, 
                    city: city, 
                    pincode: pincode,
                    state: state,
                },
                preference
            }
        }
        const result = await User.create(new_user)
        await Message.create({
            user: result._id,
            conversation: []
        })
        const token = jwt.sign({ email: result.email, id: result._id }, 'AWorldFullOfLove', { expiresIn: 2189229120000 })
        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}


export const userData = async (req, res) => {
    const _id = req.userId
    try{
        const existingUser = await User.findOne({ _id });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        res.status(200).json({
            firstname: existingUser.firstname, 
            lastname: existingUser.lastname, 
            phoneNumber: existingUser.phoneNumber, 
            countryCode: existingUser.countryCode, 
            username: existingUser.username,
            email: existingUser.email,
            dob: existingUser.dob,
            dp: existingUser.dp
        })
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const userDP = async (req, res) => {
    const userId = req.userId
    try{
        const existingUser = await User.findById( userId );
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        res.status(200).json({dp: existingUser.dp, username: existingUser.username})
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const userDataUpdate = async (req, res) => {
    const _id = req.userId
    const body  = req.body;
    try{
        const existingUser = await User.findOne({ _id });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        existingUser.firstname = body.firstname
        existingUser.lastname = body.lastname
        existingUser.phoneNumber = body.phoneNumber
        existingUser.countryCode = body.countryCode
        existingUser.email = body.email
        existingUser.dob = body.dob
        const sameUsername = await User.findOne({ username: body.username });
        if(existingUser.username!==sameUsername.username) {
            existingUser.save()
            return res.status(403).json({ message: "Can not have 2 users with same username" })
        }
        existingUser.username = body.username
        existingUser.save()
        return res.status(200).json({ message: "User Data Updated" })
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const userPasswordUpdate = async (req, res) => {
    const _id = req.userId
    const body  = req.body;
    try{
        const existingUser = await User.findOne({ _id });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const isPasswordCorrect = await bcrypt.compare(body.password, existingUser.password)
        if(!isPasswordCorrect) return res.status(403).json({ message: "Invalid Credential" })
        if(body.newPassword != body.reNewPassword) return res.status(400).json({ message: "Passwords don't match." })
        const hashedPassword = await bcrypt.hash(body.newPassword, 12);
        existingUser.password=hashedPassword
        existingUser.save()
        res.status(200).json({ message: 'Password Updated'})
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const userDataAddress = async (req, res) => {
    const _id = req.userId
    try{
        const existingUser = await User.findOne({ _id });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        res.status(200).json({
            billingAddress: existingUser.billingAddress, 
            shippingAddress: existingUser.shippingAddress, 
            name: existingUser.firstname+" "+existingUser.lastname, 
            phoneNumber: existingUser.phoneNumber, 
            countryCode: existingUser.countryCode
        })
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const deleteAddress = async (req, res) => {
    const _id = req.userId
    try{
        const existingUser = await User.findOne({ _id });
        if(!existin-gUser) return res.status(404).json({ message: "User doesn't exist" })
        existingUser.shippingAddress.map((address,i)=>{
            if(address._id==req.params.addressId){
                existingUser.shippingAddress.splice(i,1)
            }
        })
        existingUser.save()
        res.status(200).json({ message: "Address deleted"})
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const addShippingAddress = async (req, res) => {
    const body  = req.body;
    const _id = req.userId;
    try{
        const existingUser = await User.findById(_id)
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        existingUser.shippingAddress.unshift(body)
        existingUser.save()
        res.status(200).json({ message: "Address Added"})
    } catch(error) {
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const updateShippingAddress = async (req, res) => {
    const body  = req.body;
    const _id = req.userId
    try{
        const existingUser = await User.findById(_id);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        existingUser.shippingAddress.map((address)=>{
            if(address._id.toString()===body.id){
                Object.assign(address, body)
            }
        })
        existingUser.save()
        res.status(200).json({ message: "Address Updated"})
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const updateBillingAddress = async (req, res) => {
    const body  = req.body;
    const _id = req.userId
    try{
        const existingUser = await User.findById(_id);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const name = body.name.split(' ')
        existingUser.firstname=name[0]
        name.shift()
        existingUser.lastname=name.join(" ") 
        existingUser.billingAddress=body
        existingUser.save()
        res.status(200).json({ message: "Address Updated"})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const userFavourites = async (req, res) => {
    try{
        const existingUser = await User.findById(req.userId).populate('favourites');
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        res.status(200).json(existingUser.favourites)
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const addProductToFavourites = async (req, res) => {
    const body  = req.body;
    const _id = req.userId
    try{
        const existingUser = await User.findById({ _id });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const product = await Product.findById(body.productId)
        if(!product) return res.status(404).json({ message: "Product does not Exist" })
        existingUser.favourites.map(fav=>{
            if(fav.toString()===body.productId) return res.status(400).json({ message: "Product Already Exisits In Your Favourites"})
        })
        existingUser.favourites.unshift(body.productId)
        existingUser.save()
        res.status(200).json({ message: "Product Added to Favourites"})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const removeProductFromFavourites = async (req, res) => {
    const body  = req.body;
    const _id = req.userId
    try{
        const existingUser = await User.findById({ _id });
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        let flag=0
        existingUser.favourites.map((fav,i)=>{
            if(fav.toString()===body.productId){
                flag=1
                existingUser.favourites.splice(i,1)
            }
        })
        if(flag===0) return res.status(400).json({ message: "Product Does Not Exists In Your Favourites"})
        existingUser.save()
        res.status(200).json({ message: "Product Added to Favourites"})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getAllDp = async (req,res) => {
    try{
        const dp = await DP.find({})
        res.status(200).json(dp)
    }catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const setUserDp = async (req,res) => {

    const _id = req.userId
    const imageId = req.body.imageId
    try{
        const existingUser = await User.findById(_id);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        const dp = await DP.findById(imageId)
        if(!dp) res.status(400).json({ message: 'Invalid Dp'})
        existingUser.dp=dp.dp
        existingUser.save()
        const comment = await Comment.find({user: existingUser.username})
        comment.map(item=>{
            item.dp=dp.dp
            item.save()
        })
        res.status(200).json({ message: 'User Dp Set' })
    }catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong'})
    }
}
