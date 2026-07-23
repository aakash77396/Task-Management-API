const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// connect Database
connectDB();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth",authRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks",taskRoutes);

app.get("/",(req,res)=>{
    res.send("Task-Management-API Running...");
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT} `)
});