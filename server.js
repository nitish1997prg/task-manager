import "./config/env.js";
import app from "./app.js";
import connectDb from "./config/db.js";

const MONGO_URI = process.env.MONGO_URI;

const PORT = process.env.PORT;

async function startServer(){
    try{
        //Connect to DB
        await connectDb(MONGO_URI);
        console.log('Successfully connected to DB');

        //Start Express Application
        app.listen(PORT,()=>{
            console.log(`App successfully listening on PORT: ${PORT}`);
        });

    }catch(error){
        console.error(`Error starting the server : ${error}`);
        process.exit(1);
    }
}

startServer();

