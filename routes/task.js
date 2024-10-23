const express = require("express");
const router = express.Router();
const {Task} = require("../schema/task.schema");
const authMiddleware = require("../middlwares/auth");
const isAuth = require("../utils/index");

// creating a task
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, priority, taskList, dueDate, category, admins } = req.body;
        const {user} = req;
        const tasks = taskList.split(",").map(task => task.trim());  
        const adAdmins = admins.split(",").map(user => user.trim());
        const newAdmins = [user.id, ...adAdmins || []];

        const newTask = new Task({
            title,
            priority,
            taskList: tasks,
            dueDate: dueDate || null,
            category: category || null,
            creator: req.user._id || req.user.id, 
            admins: newAdmins,  
        });

        await newTask.save();

        res.status(201).json({ message: "Task created successfully"});
    } catch (error) {
        res.status(400).json({ message: "Task not created" });
    }
});

// getting the tasks
router.get("/", authMiddleware, async (req, res)=>{
    const {user} = req;
    const userId = user.id;
    isAuthenticated = isAuth(req);
    const tasks = isAuthenticated ? await Task.find({admins: userId}) : null;
    res.status(200).json(tasks);
});

// getting specific task
router.get("/:id", async (req, res)=> {
    const {id} = req.params;
    const task = await Task.findById(id);
    res.status(200).json(task);
})

// deleteting the task
router.delete("/:id", authMiddleware, async (req, res)=> {
    const {id} = req.params;
    const task = await Task.findById(id);
    if(!task){
        return res.status(404).json({message: "Task not found"});
    }
    // anyone who can see can delete
    await Task.findByIdAndDelete(id);
    res.status(200).json({message: "Task deleted Successfully"})
})

// updating the tasks
router.put("/:id", authMiddleware, async (req, res)=>{
    try {
        const {id} = req.params;
        const { title, priority, taskList, dueDate, category, admins } = req.body;
        const {user} = req;
        const tasks = taskList.split(",").map(task => task.trim());  
        const adAdmins = admins.split(",").map(user => user.trim());
        const newAdmins = [user.id, ...adAdmins || []];

        let task = await Task.findById(id);
        if(!task){
            return res.status(404).json({message: "Task not found"})
        }
        task = await Task.findByIdAndUpdate(id, {title, priority,taskList: tasks, dueDate, category, admins: newAdmins}, {new: true});
        res.status(200).json(task);

    } catch (error) {
        res.status(400).json({message: "Job not updated"});
    }

})


module.exports = router;

