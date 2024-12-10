import app from "./app.js"
import connectDB from "./database/connectDB.js"

const PORT = process.env.PORT || 4000

let server // Declare server variable at the top level

// Ensure database connection and server setup
const startServer = async () => {
  try {
    // Connect to database
    await connectDB()

    // Create a server that can be used by Vercel
    server = app.listen(PORT, () => {
      console.log(`Server 📡 is running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Immediate invocation
startServer()

export default server // Export server at the module level
