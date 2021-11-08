import connectDb from "../../utils/connectDb"
import User from "../../models/User"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import Cart from "../../models/Cart"
connectDb();
export default async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!isLength(name,{min:3, max:10})){
            return res.status(422).send("Name must be 3-10 characters long")
        }else if(!isLength(password,{min:6})){
            return res.status(422).send("Password must be at least 6 characters long")
        }else if(!isEmail(email)){
            return res.status(422).send("Email must be valid")
        }
        // 1) check if user exists
        const user=await User.findOne({email})
        if(user){
            return res.status(422).send(`User already exists with an ${email} email`)
           
        }
        // 2) hash their password
        const hash=await bcrypt.hash(password,10)
        // 3) create user
        const newUser =await new User({
            name,
            email,
            password: hash
        }).save()
        // 3.1) create new cart for the user
        const newCart=await new Cart({
            user: newUser._id
        }).save();
        // 4) create new token for the new user
        const token=jwt.sign({userId: newUser._id}, process.env.JWT_SECRET,{expiresIn: '7d'})
        // 5) sendback token
        res.status(201).json(token)
    }catch(error){
        console.error(error)
        res.status(500).send("Error signup User. Please try again")
    }
}