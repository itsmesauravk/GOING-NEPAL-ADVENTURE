import app from "./app.js";
//database
import connectDB from "./database/connectDB.js";
const PORT = process.env.PORT || 4000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server 📡 is running on port ${PORT}`);
});
