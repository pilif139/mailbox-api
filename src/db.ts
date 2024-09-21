import mongoose from 'mongoose';

export const connectDB = async () =>{
    if(!process.env.MONGO_URI){
        console.error('Mongo URI is missing in .env file');
        process.exit(1);
    }

    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err: any){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}