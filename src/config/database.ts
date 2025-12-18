import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI! as string)
        console.log("Connected to MONGODB")

        mongoose.connection.on('error', (err) => {
            console.error(' MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn(' MongoDB disconnected');
        });

    } catch(error){
        throw new Error(`Failed to connect to MONGODB: ${error}`)
    }
}

export default connectToDB;