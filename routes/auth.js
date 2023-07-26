const express = require("express");
const router = express.Router();
const { authenticateUser, logoutUser, refreshToken } = require("../controllers/authController");

router.post("/login", authenticateUser);

router.post("/logout", logoutUser);

router.post("/refresh-token", refreshToken);

module.exports = router;
