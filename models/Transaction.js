import mongoose from 'mongoose';

const Schema1 = new mongoose.Schema({
    depositor: String,
    creditor: String,
    amount: Number,
    date: String,
    time: String,
    credAccountNo: Number,
    depAccountNo: Number
})

const TransDet = mongoose.model('Transactions',Schema1);

export default TransDet;