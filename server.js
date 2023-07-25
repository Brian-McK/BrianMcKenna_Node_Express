require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("error", (error) => console.log("Connected to Database"));

app.use(express.json());

const employeesRouter = require("./routes/employees");
app.use("/employees", employeesRouter);

// const skillLevelsRouter = require("./routes/skillLevels");

// const usersRouter = require("./routes/users");

app.listen(3000, () => console.log("Server Started"));
