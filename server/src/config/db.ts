import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://temitech669:jPoHmZ3oKMVQcZQb@cluster0.inqayxa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
