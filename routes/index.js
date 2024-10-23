const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) =>{
    res.send("hello world");
});


module.exports = router;