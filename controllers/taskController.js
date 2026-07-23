import mongoose from "mongoose";
import Task from "../models/Task.js";

export async function createTask(req,res) {
    try {

        const userId = req.user.userId;

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

    }catch(error){
        console.error(`Error creating a task! ${error}`);

        return res.status(500).json({
            message:'An internal server error occurred while creating a task!'
        });
    }
}

export async function getAllTasks(req,res) {
    try {

        const userId = req.user.userId;

        const {offset, limit, completed } = req.query;

        const filter = {userId: userId};

        if(completed !== undefined){
            filter.completed = completed;
        }
        
        const tasks = await Task.find(filter).skip(offset).limit(limit);

        return res.status(200).json(tasks);

    }catch(error){
        console.error(`Error fetching all tasks ${error}`);

        return res.status(500).json({
            message:'An internal server error occurred while fetching all tasks'
        });
    }
}


export async function getTask(req,res){
    try {

        const {id} = req.params;
        const userId = req.user.userId;

        const task = await Task.findOne({_id: id, userId: userId});

        if(!task){
            return res.status(404).json({
                message: 'Task not found'
            })
        }

        return res.status(200).json(task);

    }catch(error){
        console.error(`Error fetching task by id: ${error}`);

        return res.status(500).json({
            message: 'An internal server error occurred while fetching task'
        });
    }
}

export async function updateTask(req,res){
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;

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
            return res.status(404).json({
                message:'Task not found!'
            });
        }

        return res.status(200).json(updatedTask);


    }catch(error){
        console.error(`Error updating task : ${error}`);

        return res.status(500).json({
            message: 'An internal server error occurred while updating task'
        });
    }
}

export async function deleteTask(req,res){
    try{
        const {id} = req.params;
        const userId = req.user.userId;

        const deletedTask = await Task.findOneAndDelete(
            {
                _id: id,
                userId: userId
            }
        );

        if(!deletedTask){
            return res.status(404).json({
                message: 'Task not found!'
            });
        }

        return res.status(200).json({
            message: 'Task Deleted successfully!'
        });

    }catch(error){
        console.error(`Error deleting the task! ${error} `);

        return res.status(500).json({
            message:'An internal server error occurred while deleting the task!'
        });
    }
}