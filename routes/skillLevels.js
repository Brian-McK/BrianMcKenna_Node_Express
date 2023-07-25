const express = require("express");
const router = express.Router();
const {
  getAllSkillLevels,
  getSkillLevelById,
  createSkillLevel,
  updateSkillLevel,
  deleteSkillLevel,
} = require("../controllers/skillLevelController");
const { getSkillLevel } = require("../middleware/skillLevelMiddleware");

// Get all employees
router.get("/", getAllSkillLevels);

// Get one employee by ID
router.get("/:id", getSkillLevel, getSkillLevelById);

// Create a new employee
router.post("/", createSkillLevel);

// Update an existing employee
router.put("/:id", getSkillLevel, updateSkillLevel);

// Delete an employee by ID
router.delete("/:id", getSkillLevel, deleteSkillLevel);

module.exports = router;
