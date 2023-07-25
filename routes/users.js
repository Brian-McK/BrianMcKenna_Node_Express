const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { getUser } = require("../middleware/userMiddleware");

router.get("/", getAllUsers);

router.get("/:id", getUser, getUserById);

router.post("/", createUser);

router.put("/:id", getUser, updateUser);

router.delete("/:id", getUser, deleteUser);

module.exports = router;
