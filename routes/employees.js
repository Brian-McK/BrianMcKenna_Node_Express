const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Employee = require("../models/employee");
const { getEmployee } = require("../middleware/employeeMiddleware");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/:id", getEmployee, async (req, res) => {
  res.json(res.employee);
});

router.post("/", async (req, res) => {
  const employee = new Employee({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    email: req.body.email,
    isActive: req.body.isActive
  });

  try {
    const newEmployee = await employee.save(employee);
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.put("/:id", getEmployee, async (req, res) => {
  try {
    const employeeToUpdate = res.employee;

    if (req.body.firstName) {
      employeeToUpdate.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      employeeToUpdate.lastName = req.body.lastName;
    }

    if (req.body.dob) {
      employeeToUpdate.dob = req.body.dob;
    }

    if (req.body.email) {
      employeeToUpdate.email = req.body.email;
    }

    if (req.body.isActive !== undefined) {
      employeeToUpdate.isActive = req.body.isActive;
    }

    const updatedEmployee = await employeeToUpdate.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.delete("/:id", getEmployee, async (req, res) => {
  try {
    await res.employee.deleteOne({_id: req.params.id});
    res.json({ message: "Deleted employee" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
