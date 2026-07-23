import {beforeEach, describe, expect, jest, test} from "@jest/globals";


jest.unstable_mockModule('../../models/Task.js',()=>({
    default: {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
    },
})
);

const {default: Task} = await import('../../models/Task.js');
const {createTask, getAllTasks, getTask, updateTask, deleteTask } = await import('../../controllers/taskController.js');


let consoleLogSpy;
let consoleErrorSpy;

beforeEach(()=>{
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console,"error").mockImplementation(()=> {});
    jest.clearAllMocks()
});


describe('createTask',()=>{

    test('should create a task', async ()=>{
    
    const req = {
        body: {
            title: "Second",
            description: "Second description"
        },
        user: {
            userId: "669b76d6c3f3a8b4c5e712a9"
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    Task.create.mockResolvedValue({
        _id: "123456789",
        title: "Second",
        description: "Second description"
    });

    await createTask(req,res);

    expect(Task.create).toHaveBeenCalledTimes(1);
    expect(Task.create).toHaveBeenCalledWith({
        title: "Second",
        description: "Second description",
        userId: "669b76d6c3f3a8b4c5e712a9"
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        insertedId: "123456789",
        message:"Task inserted successfully"
    });

    });

    test('should throw 500 when Task.create throws',async ()=>{
        
        const req = {
            body: {
                title: "First",
                description: "First description"
            },
            user: {
                userId: "669b76d6c3f3a8b4c5e712a9"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Task.create.mockRejectedValue(new Error("Database error"));

        await createTask(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message:"An internal server error occurred while creating a task!"
        });


    });

});

describe('getAllTasks',()=>{
    
    test('should get all tasks', async ()=>{
    
    const req = {
        query: {
            offset: 0,
            limit: 10
        },
        user: {
            userId: "669b76d6c3f3a8b4c5e712a9"
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const tasks = [
        {
            _id: "123456",
            title: "First",
            description: "First description"
        },
        {
            _id: "678912",
            title: "Second",
            description: "Second description"
        }
    ];

    Task.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(tasks)
        })
    });

   
    await getAllTasks(req,res);

    expect(Task.find).toHaveBeenCalledTimes(1);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);

    });

    test('should throw 500 error when Task.find throws', async()=>{
        
        const req = {
            query: {
                offset: 0,
                limit: 10
            },
            user: {
                userId:"669b76d6c3f3a8b4c5e712a9"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Task.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValue(new Error('Database error!'))
            })
        });
        

        await getAllTasks(req,res);

        expect(Task.find).toHaveBeenCalledTimes(1);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message:'An internal server error occurred while fetching all tasks'
        });


    });

});


describe('getTask',()=>{
    
    test('should fetch one task', async ()=>{

    const id = "507f1f77bcf86cd799439011";
    const req = {
        params: {
            id: id
        },
        user: {
            userId: "669b76d6c3f3a8b4c5e712a9"
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    const task = {
        _id: id,
        title: "First",
        description: "First description",
        userId: "669b76d6c3f3a8b4c5e712a9"
    };

    Task.findOne.mockResolvedValue(task);

    await getTask(req,res);

    expect(Task.findOne).toHaveBeenCalledTimes(1);
    expect(Task.findOne).toHaveBeenCalledWith({
        _id: id,
        userId: "669b76d6c3f3a8b4c5e712a9"
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(task);
    });

    test('should throw a 404 response when there is no task associated with id',async ()=>{
        const id = "507f1f77bcf86cd799439011";
        const req = {
            params: {
                id: id
            },
            user: {
                userId: "669b76d6c3f3a8b4c5e712a9"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Task.findOne.mockResolvedValue(null);

        await getTask(req,res);

        expect(Task.findOne).toHaveBeenCalledTimes(1);
        expect(Task.findOne).toHaveBeenCalledWith({_id: id, userId: "669b76d6c3f3a8b4c5e712a9"});

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message:'Task not found'
        });
    });

});



describe('updateTask',()=>{

    test('should update one task',async ()=>{
    const id = "507f1f77bcf86cd799439011";
    const updatedBody = {
        title: "First modified",
        description: "First description modified"
    };

    const req = {
        params: {
            id: id
        },
        body: updatedBody,
        user: {
            userId : "669b76d6c3f3a8b4c5e712a9"
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    Task.findOneAndUpdate.mockResolvedValue({
        _id: id,
        title: updatedBody.title,
        description: updatedBody.description
    });

    await updateTask(req,res);

    expect(Task.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(Task.findOneAndUpdate).toHaveBeenCalledWith({_id: id, userId: "669b76d6c3f3a8b4c5e712a9"},updatedBody,{
        returnDocument: 'after',
        runValidators: true
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        _id: id,
        title: updatedBody.title,
        description: updatedBody.description
    });
    });

    test('should throw 404 error when no task was found',async ()=>{
        const id = "507f1f77bcf86cd799439011";
        const updatedBody = {
            title: "First"
        };
        const req = {
            body: updatedBody,
            params: {
                id: id
            },
            user: {
                userId: "669b76d6c3f3a8b4c5e712a9"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Task.findOneAndUpdate.mockResolvedValue(null);

        await updateTask(req,res);

        expect(Task.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
            {_id: id, userId: "669b76d6c3f3a8b4c5e712a9"},updatedBody,
            {returnDocument: 'after',
            runValidators: true}
        );

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message:'Task not found!'
        });
    })


});


describe('deleteTask',()=>{

    test('should delete a task',async ()=>{
    const id = "507f1f77bcf86cd799439011";
    const req = {
        params: {
            id: id
        },
        user: {
            userId: "669b76d6c3f3a8b4c5e712a9"
        }
    };

    const task = {
        _id : id,
        title: "First",
        description: "First description"
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    Task.findOneAndDelete.mockResolvedValue(task);

    await deleteTask(req,res);

    expect(Task.findOneAndDelete).toHaveBeenCalledTimes(1);
    expect(Task.findOneAndDelete).toHaveBeenCalledWith({_id: id, userId: "669b76d6c3f3a8b4c5e712a9"});

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message: 'Task Deleted successfully!'
    });
    });

    test('should throw a 404 error when task to be deleted is not found',async ()=>{
        const id = "507f1f77bcf86cd799439011"
        const req = {
            params: {
                id: id
            },
            user: {
                userId: "669b76d6c3f3a8b4c5e712a9"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Task.findOneAndDelete.mockResolvedValue(null);

        await deleteTask(req,res);

        expect(Task.findOneAndDelete).toHaveBeenCalledTimes(1);
        expect(Task.findOneAndDelete).toHaveBeenCalledWith({_id: id, userId: "669b76d6c3f3a8b4c5e712a9"});

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message:'Task not found!'
        })
    });
});

