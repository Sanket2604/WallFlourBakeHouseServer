import Products from '../models/product.js'
import Users from '../models/user.js'
import Category from '../models/category.js'


export const getHomeProducts = async (req, res) => {
    try{
        const newProducts = await Products.find({}).sort({_id: -1}).limit(8)
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

export const postCategory = async (req, res) => {

    const { categoryName } = req.body;

    try{
        const existingCategory = await Category.findOne({ categoryName: categoryName });
        if(existingCategory) return res.status(404).json({ message: "Category Name Already Exists" })
        await Category.create({ categoryName })
        res.status(200).json({ message: "Category Added Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const postProduct = async (req, res) => {

    const prodDetails = req.body;

    try{
        const existingProduct = await Products.findOne({ productName: prodDetails.productName });
        if(existingProduct) return res.status(404).json({ message: "Product Name Already Exists" })
        const category = await Category.findOne({ categoryName: prodDetails.productCategory })
        if(!category) return res.status(404).json({ message: "Category does not Exist" })
        const addedProduct = await Products.create(prodDetails)
        category.categoryProducts.unshift(addedProduct._id)
        await category.save()
        res.status(200).json({ message: "Product Added Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const updateProduct = async (req, res) => {

    const { productName, productCategory, price, discount, preference, typeOfDish, description, image, quantity } = req.body;

    try{
        await Products.findByIdAndUpdate(req.params.prodId, { productName, productCategory, price, discount, preference, typeOfDish, description, image, quantity }, {new: true})
        res.status(200).json({ message: "Product Updated Successfully" })
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteProduct = async (req, res) => {

    const prodId = req.params.prodId
    
    try{
        await Products.findByIdAndDelete(prodId)
        const users = await Users.find({})
        users.map((user)=>{
            if(user.preference){
                user.preference.filter((pref)=>{
                    return pref.toString() !== prodId
                })
            }
        })
        res.status(200).json({ message: "Product Deleted Successfully" })
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong '})
    }
}

