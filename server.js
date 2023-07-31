require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { authenticateToken } = require("./validators/tokenValidators");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("error", (error) => console.log("Connected to Database..."));

app.use(express.json());
app.use(cookieParser());

const employeesRouter = require("./routes/employees");
app.use("/employees", authenticateToken, employeesRouter);

const skillLevelsRouter = require("./routes/skillLevels");
app.use("/skillLevels", authenticateToken, skillLevelsRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.listen(3000, () => console.log("Server Started..."));
