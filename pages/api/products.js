//import products from '../../static/products.json'
import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

connectDb();
export default async (req,res)=>{
    const {page,size}=req.query;
    const pageNum=Number(page);
    const sizeNum=Number(size);
    let products=[];
    const totalDocs=await Product.countDocuments();
    const totalPages=Math.ceil(totalDocs/sizeNum)
    if(pageNum === 1){
        products= await Product.find().limit(sizeNum)
    }else{
        const skips=sizeNum*(pageNum-1)
        products=await Product.find().skip(skips).limit(sizeNum)
    }
    //const products=await Product.find();
    res.status(200).json({products,totalPages});
};