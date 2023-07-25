const express = require("express");
const router = express.Router();
const { authenticateUser, logoutUser } = require("../controllers/authController");

router.post("/login", authenticateUser);

router.post("/logout", logoutUser);

module.exports = router;
