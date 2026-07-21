import jwt from "jsonwebtoken";


export const authenticate =  (req,res,next) => {

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message:'Access denied! No token provided'
        });
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decodedPayload)=>{
        
        if(err){
            return res.status(401).json({
                message:'Invalid or expired token'
            });
        }

        req.user = decodedPayload;

        next();
    });
}