import mongoose from "mongoose"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MongoDB URI is not defined")
}

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(uri)
    console.log(`MongoDB connected : ${connect.connection.name} 💾`)
  } catch (error: any) {
    console.error(error.message)
    process.exit(1)
  }
}

export default connectDB
