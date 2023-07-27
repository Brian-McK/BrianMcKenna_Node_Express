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

router.get("/", getAllEmployees);

router.get("/:id", getEmployee, getEmployeeById);

router.post("/", createEmployee);

// Update an existing employee
router.put("/:id", getEmployee, updateEmployee);

// Delete an employee by ID
router.delete("/:id", getEmployee, deleteEmployee);

module.exports = router;
