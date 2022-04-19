import User from '../models/user.js'
import moment from 'moment'

export const allUserData = async(req, res) => {

    try{
        const allAdmin = await User.find({role: "admin"},{ dp:1, firstname: 1, lastname: 1, username: 1, countryCode: 1, phoneNumber: 1, email: 1 })
        const allCustomer = await User.find({role: "customer"},{ dp:1, firstname: 1, lastname: 1, username: 1, countryCode: 1, phoneNumber: 1, email: 1 })
        res.status(200).json({allAdmin, allCustomer})
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const oneUserData = async(req, res) => {

    try{
        const oneUser = await User.findById(req.params.userId).populate('comments').populate('favourites')
        res.status(200).json(oneUser)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}