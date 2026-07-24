const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./swagger-output.json");


dotenv.config();

// connect Database
connectDB();

const app = express();
app.use(express.json());

// authRoutes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth",authRoutes);

//taskRoutes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks",taskRoutes);

//userRoutes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users",userRoutes);

// swagger
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument));

app.get("/",(req,res)=>{
    res.send("Task-Management-API Running...");
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT} `)
});