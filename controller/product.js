import Products from '../models/product.js'
import Category from '../models/category.js'


export const getHomeProducts = async (req, res) => {
    try{
        const newProducts = await Products.find({}).sort({createdAt: -1}).limit(8)
        const topSelling = await Products.find({}).sort({unitsSold: -1}).limit(8)
        const topRated = await Products.find({}).sort({rating: -1}).limit(8)
        res.status(200).json({ newProducts, topSelling, topRated })
    } catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const getProducts = async (req, res) => {
    try{
        const allCategory = await Category.find({}).populate('categoryProducts')
        res.status(200).json(allCategory)
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const getProductDetail = async (req, res) => {
    const prodName = req.params.prodName
    try{
        const product = await Products.findOne({ productName: prodName }).populate('comments')
        res.status(200).json(product)
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong '})
    }
}

