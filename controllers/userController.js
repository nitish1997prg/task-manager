import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function registerUser(req,res) {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message:'Request body missing required fields - name,email,password'
            });
        }

        const userExists = await User.findOne({email: email});

        if(userExists){
            return res.status(409).json({
                message:`A user with email address ${email} already exists!`
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        console.log(`User with email ${email} registered successfully!`);

        return res.status(201).json({
           message: 'User registered successfully!',
           insertedUserId: user._id 
        });

    }catch(error){
        
        console.error(`Error registering user! ${error}`);
        return res.status(500).json({
            message:'An internal server error occurred while registering user!'
        });

    }
}

export async function loginUser(req,res){
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:'Email and Password are required!'
            });
        }

        const userExists = await User.findOne({email: email});

        if(!userExists){
            return res.status(401).json({
                message:'Invalid credentials! Please try with correct details'
            });
        }


        const isPasswordCorrect = await bcrypt.compare(password,userExists.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message:'Invalid credentials! Please try with correct details'
            });
        }


        const token = jwt.sign({
            userId: userExists._id
        }, process.env.JWT_SECRET,{expiresIn: '1h'});

        console.log(`User with email: ${userExists.email} is successfully logged in!`);

        return res.status(200).json({
            message:'Login successful!',
            token: token
        });


    }catch(error){
        
        console.error(`Error logging in user! ${error}`);

        return res.status(500).json({
            message:'An internal server error occurred while logging in user!'
        })
    }
}