import mongoose from "mongoose";

async function connectDb(uri) {
    try {
        await mongoose.connect(uri).then(
            () => console.log('Successfully connected to MongoDB!')
        );

    }catch(error){
        console.error(`Error connecting to MongoDB: ${error}`);
        throw error;
    }
}

export default connectDb;