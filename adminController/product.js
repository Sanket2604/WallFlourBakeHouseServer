import Product from '../models/product.js'
import Category from '../models/category.js'

export const allProducts = async(req, res) => {

    try{
        const allProducts = await Product.find({})
        res.status(200).json(allProducts)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const getAllCategories = async(req, res) =>{
    try{
        const allCategories = await Category.find({})
        res.status(200).json(allCategories)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}