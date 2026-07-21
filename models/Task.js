import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true,'Title is required'],
        minlength: 5,
        maxlength: 15
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    }
},
{timestamps: true});

const Task = mongoose.model('Tasks',taskSchema);

export default Task;