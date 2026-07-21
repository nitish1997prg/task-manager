import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import connectDb from "../../config/db.js";
import User from "../../models/User.js";
import {jest,  afterAll, beforeAll } from "@jest/globals";
import mongoose from "mongoose";
import app from "../../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import '../../config/env.js';

let mongod;

beforeAll(async ()=>{
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await connectDb(uri);
    User.deleteMany();
});

afterAll(
    async ()=>{

        await mongoose.disconnect();
        await mongod.stop()

    }
);

afterEach(async ()=>{
    //Get all collections
    const collections = Object.values(mongoose.connection.collections);

    //Array of delete promises
    const deletePromises = collections.map(collection => collection.deleteMany({}));

    //Promise.all to delete
    await Promise.all(deletePromises);
});

test('should register a user successfully',async ()=>{
    const response = await request(app).post('/register').send({
        name: "Nitish",
        email: "nitish123@gmail.com",
        password: "Herzleid"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).not.toBe(null);
    expect(response.body.message).toBe('User registered successfully!');

    const user = await User.findOne({email: "nitish123@gmail.com"});
    expect(user).not.toBe(null);
});

test('should login a user successfully',async ()=>{
    
    const hashedPassword = await bcrypt.hash("Morgenstern",10);

    const createdUser = await User.create({
        name: "Nitish",
        email: "nitish123@gmail.com",
        password: hashedPassword
    });

    const response = await request(app).post('/login').send({
        email: "nitish123@gmail.com",
        password: "Morgenstern"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBe(null);

    expect(response.body.message).toBe('Login successful!');
    expect(response.body.token).not.toBe(null);

    const decoded = jwt.verify(response.body.token,process.env.JWT_SECRET);

    expect(decoded.userId).toBe(createdUser._id.toString());


});