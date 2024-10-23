const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


const {incomingRequestLogger} = require("./middlwares/index");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");


dotenv.config();
const app = express();
app.use(incomingRequestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on localhost:${process.env.PORT}`);
    mongoose.connect(process.env.MONGODB_URI_STRING);
    mongoose.connection.on("error", (err) => {
        console.log(err);
    });
});