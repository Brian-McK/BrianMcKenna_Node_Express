const express = require("express");
const router = express.Router();

// get all employees
router.get("/", (req, res) => {
    res.send("Hello World!");
});

// get one
router.get("/:id", (req, res) => {
});

// create one
router.post("/", (req, res) => {
    
});

// update one
router.patch("/:id", (req, res) => {
    
});

// delete one
router.delete("/:id", (req, res) => {
    
});

module.exports = router;
