import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req,res,next) =>{
    try{
        const token = req.header('authToken');
        const x = jwt.verify(token,JWT_SECRET);        
        req.body.userName = x.userName;        
    }
    catch{
        return res.status(401).json({msg: 'Unauthorized :('});
    }
    next();
}

export default verifyToken;