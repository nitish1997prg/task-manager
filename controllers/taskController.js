import mongoose from "mongoose";
import Task from "../models/Task.js";
import AppError from "../utils/AppError.js";

export async function createTask(req,res) {

        const {userId} = req.user;

        const {title, description} = req.body;
        
        const insertedTask = await Task.create({
            userId,
            title,
            description,
        });

        console.log(`Task inserted successfully with id: ${insertedTask._id}`);

        return res.status(201).json({
            insertedId: insertedTask._id,
            message: 'Task inserted successfully'
        });
}

export async function getAllTasks(req,res) {

        const {userId} = req.user;

        const {offset, limit, completed } = req.query;

        const filter = {userId: userId};

        if(completed !== undefined){
            filter.completed = completed;
        }
        
        const tasks = await Task.find(filter).skip(offset).limit(limit);

        return res.status(200).json(tasks);

}


export async function getTask(req,res){
    
        const {id} = req.params;
        const userId = req.user.userId;

        const task = await Task.findOne({_id: id, userId: userId});

        if(!task){
            throw new AppError(404, "Task not found!");
        }

        return res.status(200).json(task);

    
}

export async function updateTask(req,res){

        const taskId = req.params.id;
        const {userId} = req.user;

        const {title,description,completed} = req.body;

        const updateData = {};
        if(title !== undefined) updateData.title = title;
        if(description !== undefined) updateData.description = description;
        if(completed !== undefined) updateData.completed = completed;

        const updatedTask = await Task.findOneAndUpdate({
            _id: taskId,
            userId: userId
        },updateData,{
            returnDocument: 'after',
            runValidators: true
        });

        if(!updatedTask){
            throw new AppError(404,"Task not found!");
        }

        return res.status(200).json(updatedTask);
}

export async function deleteTask(req,res){

        const {id} = req.params;
        const userId = req.user.userId;

        const deletedTask = await Task.findOneAndDelete(
            {
                _id: id,
                userId: userId
            }
        );

        if(!deletedTask){
            throw new AppError(404,"Task not found!");
        }

        return res.status(200).json({
            message: 'Task Deleted successfully!'
        });

    
}