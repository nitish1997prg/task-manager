import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../app.js";
import { expect, jest }from "@jest/globals";
import mongoose from "mongoose";
import Task from "../../models/Task.js";
import User from "../../models/User.js";
import connectDb from "../../config/db.js";
import jwt from "jsonwebtoken";
import '../../config/env.js';


let mongod;
beforeAll(async ()=>{

    mongod = await MongoMemoryServer.create();
    
    const uri = mongod.getUri();

    await connectDb(uri);
    Task.deleteMany()
});

afterAll(async ()=>{
    await mongoose.disconnect();
    await mongod.stop();
});

afterEach(async ()=>{
    //Get all collections
    const collections = Object.values(mongoose.connection.collections);

    //Array of delete promises
    const deletePromises = collections.map(collection => collection.deleteMany({}));

    //Promise.all to delete
    await Promise.all(deletePromises);
});

test('should create a new task', async ()=>{

    const user = await User.create({
        name: "Nitish",
        email: "nitish123@gmail.com",
        password: "Speiluhr"
    });

    const token = jwt.sign({
        userId: user._id
    },process.env.JWT_SECRET,{expiresIn: '1h'});

    
    const response = await request(app).post("/tasks").set("Authorization",`Bearer ${token}`).
    send({
        title:"Learn Supertest",
        description: "Try to learn integration testing"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).not.toBe(null);
    expect(response.body.message).toBe("Task inserted successfully");

    const task = await Task.findById(response.body.insertedId);

    expect(task).not.toBe(null);
    expect(task.title).toBe("Learn Supertest");
    expect(task.description).toBe("Try to learn integration testing");
    
    
});

test('should get all tasks',async ()=>{
    
    const user = await User.create({
        name: "Nitish",
        email: "nitish123@gmail.com",
        password: "Speiluhr"
    });

    const token = jwt.sign({
        userId: user._id
       
    },process.env.JWT_SECRET,{expiresIn: '1h'});

    const tasks = await Task.create([
        {
            title: "First Task",
            description: "First description",
            userId: user._id
        },
        {
            title: "Second Task",
            description: "Second description",
            userId: user._id,
        },
        {
            title: "Third Task",
            description: "Third description",
            userId: user._id
        }
    ]);
    

    const response = await request(app).get("/tasks").set("Authorization",`Bearer ${token}`);


    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);

    expect(response.body).toEqual(
    expect.arrayContaining([
        expect.objectContaining({
            title: "First Task",
            description: "First description",
            userId: user._id.toString()
        }),
        expect.objectContaining({
            title: "Second Task",
            description: "Second description",
            userId: user._id.toString()
        }),
        expect.objectContaining({
            title: "Third Task",
            description: "Third description",
            userId: user._id.toString()
        })
    ])
);

});

test('should get a single task by id', async ()=>{

    const user = await User.create({
        name: "Nitish",
        email:"nitish123@gmail.com",
        password: "Speiluhr"
    });

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    const createdTask = await Task.create({
        title: "First Task",
        description: "First description",
        userId: user._id
    });

    const insertedId = createdTask._id;

    const response = await request(app).get(`/tasks/${insertedId}`).set("Authorization",`Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    

    expect(response.body).toEqual(
        expect.objectContaining(
            {
                _id: insertedId.toString(),
                title: "First Task",
                description: "First description"
            }
        )
    );

});

test('should update a task',async ()=>{

    const user = await User.create({
        name: "Nitish",
        email:"nitish123@gmail.com",
        password: "Speiluhr"
    });

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    const createdTask = await Task.create({
        title: "First Task",
        description: "First description",
        userId: user._id
    });

    const insertedId = createdTask._id;

    const response = await request(app).put(`/tasks/${insertedId}`).set("Authorization",`Bearer ${token}`).send({
        title: "First Modif",
        description: "First description modified"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
        expect.objectContaining({
            _id: insertedId.toString(),
            title: "First Modif",
            description: "First description modified",
            userId: user._id.toString()
        })
    );


});

test('should delete a task',async ()=>{

    const user = await User.create({
        name: "Nitish",
        email:"nitish123@gmail.com",
        password: "Speiluhr"
    });

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );
    
    const createdTask = await Task.create({
        title: "Title Delete",
        description: "Description delete",
        userId: user._id
    });

    const insertedId = createdTask._id;

    const response = await request(app).delete(`/tasks/${insertedId}`).set("Authorization",`Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
        message: "Task Deleted successfully!"
    })
});