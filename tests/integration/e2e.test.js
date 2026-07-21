import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import {jest, beforeAll, afterAll, expect} from "@jest/globals";
import connectDb from "../../config/db.js";
import "../../config/env.js";
import Task from "../../models/Task.js";
import User from "../../models/User.js";
import app from "../../app.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

let mongod;
beforeAll(async ()=>{
    
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await connectDb(uri);
    await Task.deleteMany({});
    await User.deleteMany({});

});

afterAll(async ()=>{
    await mongoose.disconnect();
    await mongod.stop();
});

test('end to end test from registration to crud tasks',async ()=>{

    //User Registration 
    const registeredUserResponse = await request(app).post('/register').send({
        name: "Nitish",
        email: "nitish123@gmail.com",
        password: "Adieu"
    });

    const createdUser = await User.findOne({email: "nitish123@gmail.com"});

    expect(registeredUserResponse.statusCode).toBe(201);
    expect(registeredUserResponse.body).not.toBe(null);
    expect(registeredUserResponse.body.insertedUserId).toBe(createdUser._id.toString());

    //User Login
    const loginUserResponse = await request(app).post('/login').send({
        email: "nitish123@gmail.com",
        password: "Adieu"
    });

    const decoded = jwt.verify(loginUserResponse.body.token,process.env.JWT_SECRET);

    expect(loginUserResponse.statusCode).toBe(200);
    expect(loginUserResponse.body).not.toBe(null);
    expect(loginUserResponse.body.token).not.toBe(null);
    expect(decoded.userId).toBe(createdUser._id.toString());

    const token = loginUserResponse.body.token;

    //Task creation
    const createdTaskResponse = await request(app).post('/tasks').set(
        "Authorization",`Bearer ${token}`
    ).send({
        title: "First",
        description: "First Task"
    });

    const createdTask = await Task.findOne({_id: createdTaskResponse.body.insertedId});

    expect(createdTaskResponse.statusCode).toBe(201);
    expect(createdTaskResponse.body.insertedId).toBe(createdTask._id.toString());

    //Get All Tasks 
    const secondTaskResponse = await request(app).post('/tasks').set("Authorization",`Bearer ${token}`).send(
        {
            title: "Second",
            description: "Second description",
            userId: createdUser._id
        }
    );

    const getAllTasksResponse = await request(app).get('/tasks').set("Authorization",`Bearer ${token}`);

    expect(getAllTasksResponse.statusCode).toBe(200);
    expect(getAllTasksResponse.body).not.toBe(null);

    expect(getAllTasksResponse.body).toEqual(
        expect.arrayContaining(
            [
                expect.objectContaining({
                    title: "First",
                    description: "First Task",
                    userId: createdUser._id.toString()
                }),
                expect.objectContaining({
                    title: "Second",
                    description: "Second description",
                    userId: createdUser._id.toString()
                })
            ]
        )
    );

    //Get Single task
    const getSingleTaskResponse = await request(app).get(`/tasks/${createdTask._id.toString()}`).set("Authorization",`Bearer ${token}`);

    expect(getSingleTaskResponse.statusCode).toBe(200);
    expect(getSingleTaskResponse.body).not.toBe(null);
    expect(getSingleTaskResponse.body._id).toBe(createdTask._id.toString());
    expect(getSingleTaskResponse.body.userId).toBe(createdTask.userId.toString());
    expect(getSingleTaskResponse.body.title).toBe("First");

    //Update task
    const updateTaskResponse = await request(app).put(`/tasks/${createdTask._id.toString()}`).set("Authorization",`Bearer ${token}`).send({
        title: "First Mod",
        description: "First description modified"
    });

    const updatedTask = await Task.findOne({_id: createdTask._id});

    expect(updateTaskResponse.statusCode).toBe(200);
    expect(updateTaskResponse.body).toEqual(
        expect.objectContaining({
            _id: updatedTask._id.toString(),
            title: "First Mod",
            description: "First description modified"
        })
    );
    expect(updateTaskResponse.body.title).toBe(updatedTask.title);
    expect(updateTaskResponse.body.description).toBe(updatedTask.description);
    expect(updateTaskResponse.body.userId).toBe(createdUser._id.toString());


    //Delete Task
    const deletedTaskResponse = await request(app).delete(`/tasks/${createdTask._id.toString()}`).set("Authorization",`Bearer ${token}`);

    const userTasks = await Task.find({userId: createdUser._id});

    const expectedTaskResponse = await request(app).get(`/tasks/${createdTask._id.toString()}`).set("Authorization",`Bearer ${token}`);

    expect(deletedTaskResponse.statusCode).toBe(200);
    expect(userTasks.length).toBe(1);
    expect(expectedTaskResponse.statusCode).toBe(404);

});