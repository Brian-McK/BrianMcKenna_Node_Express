const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { getEmployee } = require("../middleware/employeeMiddleware");
const { authenticateToken } = require("../validators/tokenValidators");

// Get all employees
router.get("/", getAllEmployees);

// Get one employee by ID
router.get("/:id", getEmployee, getEmployeeById);

// Create a new employee
router.post("/", createEmployee);

// Update an existing employee
router.put("/:id", getEmployee, updateEmployee);

// Delete an employee by ID
router.delete("/:id", getEmployee, deleteEmployee);

module.exports = router;
