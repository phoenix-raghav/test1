import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    accountNo: Number
})

const AccountNo = mongoose.model('AccountNo',Schema);
export default AccountNo;