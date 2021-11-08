import jwt from 'jsonwebtoken'
import connectDb from '../../utils/connectDb'
import mongoose from 'mongoose'
import Cart from '../../models/Cart'

const {ObjectId}=mongoose.Types
connectDb()
export default async(req,res)=>{
    switch(req.method){
        case "GET":
            await handleGetRequest(req,res);
            break;
        case "PUT":
            await handlePutRequest(req,res);
            break;
        case "DELETE":
            await handleDeleteRequest(req,res);
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
            break;
    }
}
async function handlePutRequest(req,res){
    const {quantity,productId}=req.body;
    if(!("authorization" in req.headers))
        return res.status(401).send("No authorization token")
    try {
        const {userId}=jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
        const cart = await Cart.findOne({user: userId})
        const productExists=cart.products.some(doc=> ObjectId(productId).equals(doc.product))
        if(productExists){
            await Cart.findOneAndUpdate(
                {_id:cart._id,"products.product":productId},
                {$inc:{"products.$.quantity":quantity}}
            )
        }else{
            const newProduct={quantity,product:productId}
            await Cart.findOneAndUpdate(
                {_id:cart._id},{$addToSet:{products:newProduct}}
            )
        }
        res.status(200).send("Cart updated")
    } catch (error) {
        console.error(error)
        res.status(403).send("Please login again")
    }
}
async function handleGetRequest(req,res){
    if(!("authorization" in req.headers))
        return res.status(401).send("No authorization token")
    try{
        const {userId}=jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
        const cart = await Cart.findOne({user: userId}).populate({
            path:"products.product",
            model:"Product"
        })
        res.status(200).json(cart.products)
    }catch(error){
        console.error(error)
        res.status(403).send("Please login again")
    }
}
async function handleDeleteRequest(req,res){
    const {productId}=req.query
    
    if(!("authorization" in req.headers))
        return res.status(401).send("No authorization token")
    try {
        
        const {userId}=jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
        const cart=await Cart.findOneAndUpdate({user: userId},
                                                {$pull:{products:{product:productId}}},
                                                {new:true}).populate({path:"products.product",
                                                model:"Product"})
        res.status(200).json(cart.products)
    } catch (error) {
        console.error(error)
        res.status(403).send("Please login again")
    }
}