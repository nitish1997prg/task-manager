import {jest, beforeEach, beforeAll, test, expect} from "@jest/globals";

jest.unstable_mockModule('../../models/User.js',()=>({
    default: {
        create: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.unstable_mockModule('bcrypt',()=>({
    default: {
        hash: jest.fn(),
        compare: jest.fn()
    }
}));

jest.unstable_mockModule('jsonwebtoken',()=>({
    default: {
        sign: jest.fn()
    }
}));

const {default: User} = await import("../../models/User.js");
const {default: bcrypt} = await import('bcrypt');
const {default: jwt} = await import('jsonwebtoken');


const { registerUser , loginUser} = await import("../../controllers/userController.js");

beforeEach(()=>{
     consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
     consoleErrorSpy = jest.spyOn(console,"error").mockImplementation(()=> {});
    jest.clearAllMocks();
});

describe('registerUser',()=>{
    test('should register a user', async ()=>{
        const user = {
            _id: "669b76d6c3f3a8b4c5e712a9",
            name: "Nitish",
            email: "nitish123@gmail.com",
            password: "Herzleid"
        };

        const req = {
            body: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(user);
        bcrypt.hash.mockResolvedValue("hashedPassword");

        await registerUser(req,res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({email: user.email});

        expect(User.create).toHaveBeenCalledTimes(1);
        expect(User.create).toHaveBeenCalledWith({
            name: user.name,
            email: user.email,
            password: "hashedPassword"
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message:'User registered successfully!',
            insertedUserId: user._id
        });

    });

    test('should throw 409 error when user with email already exists',async ()=>{
        const req = {
            body: {
                name: "Nitish",
                email: "nitish123@gmail.com",
                password: "Herzleid"
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        User.findOne.mockResolvedValue({
            name: "Nitish V",
            email: "nitish123@gmail.com",
            password: "Herz"
        });

        await registerUser(req,res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({email: req.body.email});

        expect(User.create).toHaveBeenCalledTimes(0);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
             message:`A user with email address ${req.body.email} already exists!`
        });
    });

    test('database throws error 500',async ()=>{

        const req = {
            body: {
                name: "Nitish",
                email: "nitish123@gmail.com",
                password: "Herzleid"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockRejectedValue(new Error("Database error!"));

        await registerUser(req,res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({email: req.body.email});

        expect(User.create).toHaveBeenCalledTimes(0);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message:'An internal server error occurred while registering user!'
        });


    });
});

describe('loginUser',()=>{
    test('should login a user successfully',async ()=>{
        const req = {
            body: {
                email: "nitish123@gmail.com",
                password: "Herzleid"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const userId = "669b76d6c3f3a8b4c5e712a9";
        User.findOne.mockResolvedValue({
            _id: "669b76d6c3f3a8b4c5e712a9",
            email: "nitish123@gmail.com",
            password: "Herzleid"
        });

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnValue("Supersecret");

        await loginUser(req,res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({email: req.body.email});

        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(jwt.sign).toHaveBeenCalledWith({
            userId: userId
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:'Login successful!',
            token: "Supersecret"
        });
    });
    test('should throw 401 error when user with email does not exist',async ()=>{
        
        const req = {
            body: {
                email: "nitish123@gmail.com",
                password: "Herzleid"
            }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue(null);

        await loginUser(req,res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({email: req.body.email});

        expect(jwt.sign).toHaveBeenCalledTimes(0);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
             message:'Invalid credentials! Please try with correct details'
        });


    });
    test('should throw 401 error when user password is incorrect',async ()=>{
        const req = {
            body: {
                email: "nitish123@gmail.com",
                password: "Herzleid"
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue({
            _id: "669b76d6c3f3a8b4c5e712a9",
            name: "Nitish",
            email: "nitish123@gmail.com",
            password: "Herz"
        });

        bcrypt.compare.mockResolvedValue(false);

        await loginUser(req,res);

        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({email: req.body.email});

        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password,"Herz");

        expect(jwt.sign).toHaveBeenCalledTimes(0);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message:'Invalid credentials! Please try with correct details'
        });

    });
});


