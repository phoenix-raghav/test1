import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import verifyToken from '../middlewares/Token.js';
import bcryptjs from 'bcryptjs';
import AccountNo from '../models/AccountNo.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_KEY = process.env.JWT_SECRET;

const Router = express.Router();

Router.post('/signup',[body('password','Password should contain atleast 3 characters').isLength({min:3})],async(req,res)=>{
    try{
        let user = await User.findOne({accountNo: req.body.accountNo});
        if(!user || (user&&user.userName)) return res.status(400).json({msg: 'Please enter a valid account number'});
        user = await User.findOne({userName: req.body.userName});
        if(user) return res.status(400).json({msg: 'Username already exists'});
        const errors = validationResult(req).errors;
        if(errors.length)   return res.status(400).json({msg: errors[0].msg});
        req.body.password = await bcryptjs.hash(req.body.password,10);
        user = await User.findOneAndUpdate({accountNo:req.body.accountNo},{userName:req.body.userName,password:req.body.password});
        user.userName = req.body.userName;
        const token = jwt.sign({userName: req.body.userName},JWT_KEY);
        return res.status(200).json({msg:'User Registered Successfully :)', body:user, authToken: token});
    }
    catch{
        return res.status(500).json({msg: 'Internal server error'});
    }
})
Router.post('/login',async(req,res)=>{
    try{
        let user = await User.findOne({userName: req.body.userName});
        if(!user) return res.status(400).json({msg: 'Invalid Credentials'});
        const isMatched = await bcryptjs.compare(req.body.password,user.password);
        if(!isMatched) return res.status(400).json({msg: 'Invalid Credentials'});
        const token = jwt.sign({userName: req.body.userName},JWT_KEY);
        return res.status(200).json({msg:'Logged In Successfully :)', body: user, authToken: token});
    }
    catch{
        return res.status(500).json({msg: 'Internal server error'});
    }
})
Router.post('/createAccount',[body('phoneNo','Please enter a valid Phone Number').isLength({min:10, max:10}),[body('email','Please enter a valid email').isEmail()]],async(req,res)=>{
    try{
        const errors = validationResult(req).errors;
        if(errors.length)   return res.status(400).json({msg: errors[0].msg});
        const body = req.body;
        let user = await User.findOne({$or : [{phoneNo: body.phoneNo}, {email: body.email}]});
        if(user)    return res.status(400).json({msg: 'Contact Details had already been linked to another account'});
        let acc = await AccountNo.findOne({accountNo: {$exists : true}});
        if(acc==null)
        {
            acc = AccountNo({accountNo: 1000000000});
            await acc.save();
        }
        acc = await AccountNo.find({accountNo: {$exists : true}});
        await AccountNo.updateOne({accountNo: acc[0].accountNo}, {accountNo: acc[0].accountNo+1});
        const imageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1G2ye1gTauHDy5vh2qNCNyWvAKO_KpcYFgZ17--uBC1CjYuAoqYeC9rIVEQme_p6pjY&usqp=CAU";
        user = User({name:body.name, address:body.address,gender:body.gender,dob:body.dob,phoneNo: body.phoneNo, email: body.email, accountNo: acc[0].accountNo+1, balance: body.balance, imageURL: imageURL});
        await user.save();
        return res.status(200).json({msg:'Account created Successfully :)', accountNo: acc[0].accountNo+1});
    }
    catch(err){
        return res.status(500).json({msg: 'Internal server error'});
    }
})
Router.post('/updateDetails',verifyToken,async(req,res)=>{
    try{
        if(req.body.userName)
        {
            await User.updateOne({userName: req.body.userName},req.body.content);
            return res.status(200).json({msg:"Details Updated"});
        }
        else    return res.status(401).json({msg:"UnAuthorized"});
    }
    catch{
        return res.status(500).json({msg: 'Internal server error'});
    }
})

Router.post('/getUser',verifyToken,async(req,res)=>{
    try{
        if(req.body.userName)
        {
            const user = await User.findOne({userName:req.body.userName});
            return res.status(200).json({msg:"User Found", body: user});
        }
        else    return res.status(401).json({msg:"UnAuthorized"});
    }
    catch{
        return res.status(500).json({msg: 'Internal server error'});
    }
})
export default Router;