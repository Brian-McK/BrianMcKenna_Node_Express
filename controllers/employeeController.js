const { validateSkills } = require("../validators/skillLevelValidators");
const { validateEmployee } = require("../validators/validateEmployee");
const Employee = require("../models/employee");
const SkillLevel = require("../models/skillLevel");
const mongoose = require("mongoose");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Get one employee by ID
exports.getEmployeeById = async (req, res) => {
  res.status(200).json(res.employee);
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { error, value } = validateEmployee(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const foundEmployeeByEmail = await Employee.findOne({
      email: value.email,
    });

    if (foundEmployeeByEmail) {
      return res.status(409).json({ message: "User already exists" });
    }

    const skillObjectReferences = await validateSkills(value.skillLevels);

    const employee = new Employee({
      firstName: value.firstName,
      lastName: value.lastName,
      dob: value.dob,
      email: value.email,
      isActive: value.isActive,
      skillLevels: skillObjectReferences,
    });

    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const { error, value } = validateEmployee(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const employeeToUpdate = res.employee;

    if (value.firstName) {
      employeeToUpdate.firstName = value.firstName;
    }

    if (value.lastName) {
      employeeToUpdate.lastName = value.lastName;
    }

    if (value.dob) {
      employeeToUpdate.dob = value.dob;
    }

    if (value.email) {
      employeeToUpdate.email = value.email;
    }

    if (value.isActive !== undefined) {
      employeeToUpdate.isActive = value.isActive;
    }

    if (value.skillLevels) {
      employeeToUpdate.skillLevels = await validateSkills(value.skillLevels);
    }

    const updatedEmployee = await employeeToUpdate.save();
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    await res.employee.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted employee" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
