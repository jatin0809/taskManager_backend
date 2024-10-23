const mongoose = require("mongoose");
const schema = mongoose.Schema;
const User = require("./user.schema");

const taskSchema = new schema({
    title: {type: String, required: true},
    priority: {
        type: String,
        enum: ["low", "moderate", "high"],
        required: true
    },
    admins: {type: [String], default: []},
    taskList: {
        type: [String],
        validate: [taskList => taskList.length > 0, 'taskList must contain atleast one task'],
        required: true
    },
    dueDate: {type: Date},
    category: {type: String, default: null},
    creator: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
}, {
    timestamps:true
})

const Task = mongoose.model("Task", taskSchema);
module.exports = {
    Task
}