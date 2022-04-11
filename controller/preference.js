import Preference from '../models/preference.js'
import User from '../models/user.js'

export const getAllPreference = async (req, res) => {

    try{
        const allPreference = await Preference.find({})
        res.status(200).json(allPreference)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getUserPreference = async (req, res) => {

    try{
        const existingUser = await User.findById(req.userId)
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        res.status(200).json(existingUser.preference)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}


export const postPreferenceToUser = async (req, res) => {

    const body = req.body
    try{
        const existingUser = await User.findById(req.userId)
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })
        existingUser.preference=body.preference
        existingUser.save()
        res.status(200).json({ message: "Preferce Added to User" })
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}
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

    try{
        const allPreference = await Preference.find({})
        res.status(200).json(allPreference)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deletePreference = async (req, res) => {

    try{
        const allPreference = await Preference.find({})
        res.status(200).json(allPreference)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}





