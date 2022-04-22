import User from '../models/user.js'
import Product from '../models/product.js'
import Preference from '../models/preference.js'

export const postPreference = async (req, res) => {

    const body = req.body;
    try{
        const existingPreference = await Preference.findOne({ preferenceName: body.preferenceName });
        if(existingPreference) return res.status(404).json({ message: "Preference Name Already Exists" })
        await Preference.create(body)
        res.status(200).json({ message: "Preference Added Successfully" })
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const updatePreference = async (req, res) => {

    const body = req.body
    try{
        const existingPreference = await Preference.findById(req.params.prefId);
        if(!existingPreference) return res.status(404).json({ message: "Preference Does Not Exists" })
        const users = await User.find({})
        const allProducts = await Product.find({});
        users.map((user)=>{
            user.preference.map((pref,i)=>{
                if(pref===existingPreference.preferenceName){
                    pref=body.preferenceName
                    user.save()
                }
            })
        })
        allProducts.map((prod)=>{
            prod.preference.map((pref,i)=>{
                if(pref===existingPreference.preferenceName){
                    pref=body.preferenceName
                    prod.save()
                }
            })
        })
        await Preference.findByIdAndUpdate(req.params.prefId, body, {new: true})
        res.status(200).json({ message: "Preference Added Successfully" })
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deletePreference = async (req, res) => {

    try{
        const existingPreference = await Preference.findById(req.params.prefId);
        if(!existingPreference) return res.status(404).json({ message: "Preference Does Not Exists" })
        const users = await User.find({})
        const allProducts = await Product.find({});
        users.map((user)=>{
            user.preference.map((pref,i)=>{
                if(pref===existingPreference.name){
                    prod.preference.splice(i,1)
                    prod.save()
                }
            })
        })
        allProducts.map((prod)=>{
            prod.preference.map((pref,i)=>{
                if(pref===existingPreference.name){
                    prod.preference.splice(i,1)
                    prod.save()
                }
            })
        })
        await Preference.findByIdAndDelete(req.params.prefId)
        res.status(200).json({ message: "Preference Added Successfully" })
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}