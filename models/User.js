import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    name: String,
    address: String,
    gender: String,
    dob: String,
    imageURL: String,
    password: String,
    balance: Number,
    phoneNo: {
        type: Number,
        unique: true
    },
    accountNo: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    userName: {
        type: String,
        // unique: true
    },
})

const User = mongoose.model('Users',Schema);
User.createIndexes({userName:1});
export default User;