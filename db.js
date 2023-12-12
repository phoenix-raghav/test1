import db from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.DATABASE_URL;

const connectToMongo = async() =>{
    try{
        await db.connect(mongoURL);
        console.log('Database Connected');
    }
    catch(err){
        console.log(err)
        console.log('Error connecting database');
    }
}

export default connectToMongo;
// // module.exports = connectToMongo;
