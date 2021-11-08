import Product from "../../models/Product"
import connectDb from "../../utils/connectDb"
import Cart from "../../models/Cart"
// export default async (req,res)=>{
//     const {_id}=req.query;
//     const product=await Product.findOne({_id});
//     res.status(200).json(product)
// }

connectDb();
export default async (req,res)=>{
    switch(req.method){
        case "GET":
            await handleGetRequest(req,res);
            break;
        case "DELETE":
            await handleDeleteRequest(req,res);
            break;
        case "POST":
            await handlePostRequest(req,res);
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);
            break;
    }
}
async function handlePostRequest(req,res){
    try{
        const {name,price,description,mediaUrl}=req.body;
        await new Product({
                name,
                price,
                description,
                mediaUrl
            }).save()
     res.status(201).json()
        }catch(error){
            console.error(error)
            res.status(500).send("Server Error in creating product")
        }
    
}
async function handleGetRequest(req,res){
    const {_id}=req.query;
    const product=await Product.findOne({_id});
    res.status(200).json(product);
}
async function handleDeleteRequest(req,res){
    try{
        const {_id}=req.query;
        await Product.findOneAndDelete({_id});
        await Cart.updateMany(  {"products.product":_id},
                                {$pull:{products:{product:_id}}})
        res.status(204).json({});
    }catch(error){
        console.error(error);
        res.status(500).send("Error deleting product")
    }
}