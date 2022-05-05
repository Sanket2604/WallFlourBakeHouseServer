import User from '../models/user.js'
import Product from '../models/product.js'
import Category from '../models/category.js'
import Comment from '../models/comment.js'

export const getAllCategories = async(req, res) =>{
    try{
        const allCategories = await Category.find({})
        res.status(200).json(allCategories)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const postCategory = async (req, res) => {

    const { categoryName } = req.body;
    try{
        const existingCategory = await Category.findOne({ categoryName: categoryName });
        if(existingCategory) return res.status(400).json({ message: "Category Name Already Exists" })
        await Category.create({ categoryName })
        res.status(200).json({ message: "Category Added Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const updateCategory = async (req, res) => {

    const body = req.body;
    try{
        const currentCategory = await Category.findById(req.params.catId).populate('categoryProducts')
        if(!currentCategory) return res.status(404).json({ message: "Category Does Not Exists" })
        const existingNewCategory = await Category.findOne({categoryName: body.categoryName})
        if(existingNewCategory) return res.status(400).json({ message: "Category Already Exists" })
        currentCategory.categoryProducts.map((prod)=>{
            prod.productCategory=body.categoryName
            prod.save()
        })
        await Category.findByIdAndUpdate(req.params.catId, body, {new: true})
        res.status(200).json({ message: "Category Updated Successfully" })
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteCategory = async (req, res) => {

    try{
        const currentCategory = await Category.findById(req.params.catId).populate('categoryProducts')
        if(!currentCategory) return res.status(404).json({ message: "Category Does Not Exists" })
        if(currentCategory.categoryProducts.length>0) return res.status(400).json({ message: "Remove All "+currentCategory.categoryProducts.length+" Products from the Category" })
        currentCategory.deleted=true
        currentCategory.save()
        res.status(200).json({ message: "Category Deleted Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const restoreCategory = async (req, res) => {

    try{
        const currentCategory = await Category.findById(req.params.catId).populate('categoryProducts')
        if(!currentCategory) return res.status(404).json({ message: "Category Does Not Exists" })
        currentCategory.deleted=false
        currentCategory.save()
        res.status(200).json({ message: "Category Restored Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const allProducts = async(req, res) => {

    try{
        const allProducts = await Product.find({})
        res.status(200).json(allProducts)
    } catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const postProduct = async (req, res) => {

    const prodDetails = req.body;
    try{
        const existingProduct = await Product.findOne({ productName: prodDetails.productName });
        if(existingProduct) return res.status(404).json({ message: "Product Name Already Exists" })
        const category = await Category.findOne({ categoryName: prodDetails.productCategory })
        if(!category) return res.status(404).json({ message: "Category does not Exist" })
        const addedProduct = await Product.create({
            productName: prodDetails.productName,
            productCategory: prodDetails.productCategory,
            price: prodDetails.price,
            discount: prodDetails.discount,
            preference: prodDetails.preference,
            typeOfDish: prodDetails.typeOfDish,
            batchSize: prodDetails.batchSize,
            customisation: prodDetails.customisation,
            allergy: prodDetails.allergy,
            quantity: prodDetails.quantity,
            description: prodDetails.description,
            image: prodDetails.image,
        })
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

    const body = req.body;

    try{
        const existingProduct = await Product.findById(req.params.prodId);
        if(!existingProduct) return res.status(404).json({ message: "Product Name Already Exists" })
        if(existingProduct.productCategory!==body.productCategory){
            const oldcategory = await Category.findOne({ categoryName: existingProduct.productCategory })
            if(!oldcategory) return res.status(404).json({ message: "Old Category Not Found" })
            oldcategory.categoryProducts.forEach((cat,i)=>{
                if(cat.toString() === existingProduct._id.toString()){
                    oldcategory.categoryProducts.splice(i,1)
                }
            })
            const newcategory = await Category.findOne({ categoryName: body.productCategory })
            if(!newcategory) return res.status(404).json({ message: "New Category Not Found" })
            newcategory.categoryProducts.unshift(body._id)
            oldcategory.save()
            newcategory.save()
        }
        await Product.findByIdAndUpdate(req.params.prodId, body, {new: true})
        res.status(200).json({ message: "Product Updated Successfully" })
    }
    catch(error){
        res.status(500).json({ message: 'Something went wrong'})
    }
}

export const deleteProduct = async (req, res) => {

    const prodId = req.params.prodId

    try{
        const productToDelete = await Product.findById(prodId)
        if(!productToDelete) return res.status(404).json({ message: "Product Does Not Exist" })
        const categories = await Category.findOne({categoryName: productToDelete.productCategory})
        if(!categories) return res.status(404).json({ message: "Category Not Found" })
        categories.categoryProducts.map((prod,i)=>{
            if(prod.toString()===prodId.toString()){
                categories.categoryProducts.splice(i,1)
            }
        })
        const trash = await Category.findOne({categoryName: "Trash"})
        if(!trash) return res.status(404).json({ message: "Trash Not Found" })
        trash.categoryProducts.unshift(prodId)
        const users = await User.find({})
        users.map(user=>{
            user.favourites.map((fav,i)=>{
                if(fav.toString()===prodId.toString()){
                    user.favourites.splice(i,1)
                }
            })
            productToDelete.comments.map((comment)=>{
                user.comments.map((userComment,i)=>{
                    if(comment.toString()===userComment.toString()){
                        user.comments.splice(i,1)
                    }
                })
            })
            user.save()
        })
        await Comment.deleteMany({_id: { $in: productToDelete.comments}});
        productToDelete.rating=5
        productToDelete.comments=[]
        productToDelete.productCategory="Trash"
        productToDelete.deleted=true
        categories.save()
        trash.save()
        productToDelete.save()
        res.status(200).json({ message: "Product Deleted Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

export const restoreProduct = async (req, res) => {

    const prodId = req.params.prodId
    const body = req.body
    try{
        console.log(body)
        const productToRestore = await Product.findById(prodId)
        if(!productToRestore) return res.status(404).json({ message: "Product Does Not Exist" })
        if(body.productCategory==="Trash") return res.status(404).json({ message: "Select A Category To Restore" })
        const category = await Category.findOne({categoryName: body.productCategory})
        if(!category) return res.status(404).json({ message: "New Category Not Found" })
        const trash = await Category.findOne({categoryName: "Trash"})
        if(!trash) return res.status(404).json({ message: "Trash Not Found" })
        trash.categoryProducts.map((cat,i)=>{
            if(cat.toString()===prodId.toString()){
                trash.categoryProducts.splice(i,1)
            }
        })
        category.categoryProducts.unshift(prodId)
        productToRestore.productCategory= body.productCategory
        productToRestore.deleted=false
        trash.save()
        category.save()
        productToRestore.save()
        res.status(200).json({ message: "Product Restored Successfully" })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Something went wrong '})
    }
}