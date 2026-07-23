import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";


export async function registerUser(req,res) {
        
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email: email});

        if(userExists){
            throw new AppError(409,`A user with email address ${email} already exists!`);
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log(`User with email ${email} registered successfully!`);

        return res.status(201).json({
           message: 'User registered successfully!',
           insertedUserId: user._id 
        });
}

export async function loginUser(req,res){

        const {email, password} = req.body;

        const userExists = await User.findOne({email: email});

        if(!userExists){
            throw new AppError(401,"Invalid credentials! Please try with correct details");
        }


        const isPasswordCorrect = await bcrypt.compare(password,userExists.password);

        if(!isPasswordCorrect){
            throw new AppError(401,"Invalid credentials! Please try with correct details");
        }


        const token = jwt.sign({
            userId: userExists._id
        }, process.env.JWT_SECRET,{expiresIn: '1h'});

        console.log(`User with email: ${userExists.email} is successfully logged in!`);

        return res.status(200).json({
            message:'Login successful!',
            token,
        });
}