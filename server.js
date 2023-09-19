const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/v1/user", require("./routes/userRoutes"));
app.use('/uploads', express.static('uploads'));
// Uncomment and configure other routes as needed:
app.use('/api/v1/admin', require('./routes/adminRoutes'))
app.use('/api/v1/college', require('./routes/collegeRoutes'))
// app.use("/api/v1/messages", require('./routes/messageRoutes'));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.bgCyan.white);
});
