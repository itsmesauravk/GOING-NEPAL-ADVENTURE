import app from "./app.js";
//database
import connectDB from "./database/connectDB.js";
const PORT = process.env.PORT || 4000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server 📡 is running on port ${PORT}`);
});
// import app from "./app.js"
// import connectDB from "./database/connectDB.js"
// // Connect to the database (ensure it does not block execution)
// connectDB()
// // Export the app for Vercel (DO NOT USE app.listen)
// export default app
