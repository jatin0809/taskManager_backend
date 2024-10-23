const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const {User} = require("../schema/user.schema");
const authMiddleware = require("../middlwares/auth")

dotenv.config();

// register
router.post("/register", async (req, res)=>{
    const { name, email, password} = req.body;
    const ifUserExists = await User.findOne({email});
    if(ifUserExists){
        return res.status(400).json({message: "User already Exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: "User created Successfully"});
})

// get all users
router.get("/", async (req, res)=> {
    const users = await User.find({}).select("-password");
    res.status(200).json({users});
})

// get user by email
router.get("/:email", async (req, res)=>{
    const email = req.params;
    const user = await User.findOne({email}).select("-password");
    console.log(user);
    if(!user){
        return res.status(400).json({message: "User not found"});
    }
    res.status(200).json(user);
})

// login
router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Wrong email or password"});
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return res.status(400).json({message: "Wrong email or password"});
    }
    const payload = {id: user._id};
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({token});
})

// updating user details
router.put("/:id", authMiddleware, async (req, res)=>{
    try {
        const {id} = req.params;
        const { name, email, oldPassword, newPassword} = req.body;
        let user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: "User not Found"});
        }

        const passCheck = await bcrypt.compare(oldPassword, user.password);
        if(!passCheck){
            return res.status(400).json({message: "Wrong password"});
        }
        const updatedFields = {name, email};
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);  // Hash new password
            updatedFields.password = hashedPassword;
        }
        user = await User.findByIdAndUpdate(id, updatedFields, {new: true});
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(400).json({message: "User not updated"});
        console.log(error);
    }

} )


module.exports = router;