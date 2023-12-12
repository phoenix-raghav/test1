import express from 'express';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import TransDet from '../models/Transaction.js';

const Router = express.Router();
Router.post('/',async(req,res)=>{
    try{
        let cred = await User.findOne({accountNo:req.body.credAccNo, userName: req.body.credUserName});
        if(!cred) return res.status(400).json({msg: 'Please enter a valid account number'});
        let dep = await User.findOne({userName: req.body.depUserName});
        const isMatched = await bcryptjs.compare(req.body.depPassword, dep.password);
        if(!isMatched) return res.status(400).json({msg: 'Incorrect Pasword'});
        await User.updateOne({userName:req.body.depUserName},{balance: dep.balance-Number(req.body.amount)});
        cred = await User.findOne({accountNo:req.body.credAccNo, userName: req.body.credUserName});
        await User.updateOne({userName:req.body.credUserName},{balance: cred.balance+Number(req.body.amount)});
        const date = new Date();

        const trans = TransDet({depositor: req.body.depUserName, creditor: req.body.credUserName, amount: req.body.amount, date: date.toDateString(), time: date.toLocaleTimeString(),credAccountNo:req.body.credAccNo, depAccountNo: req.body.depAccNo})

        await trans.save();
        return res.status(200).json({msg:'Transaction Successful :)'});
    }
    catch(err){
        return res.status(500).json({msg: 'Internal server error'});
    }
})

Router.post('/getTransList',async(req,res)=>{
    try{
        const list = await TransDet.find({$or : [{creditor:req.body.userName},{depositor:req.body.userName}]})
        return res.status(200).json({msg:'Operation Successful :)', list: list});
    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg: 'Internal server error'});
    }
})
export default Router;