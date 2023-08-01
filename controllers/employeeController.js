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
    res.status(500).json({ message: error.message });
  }
};

// Get one employee by ID
exports.getEmployeeById = async (req, res) => {
  res.status(200).json(res.employee);
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      error,
      value: { firstName, lastName, dob, email, isActive, skillLevels },
    } = validateEmployee(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const foundEmployeeByEmail = await Employee.findOne({
      email: email,
    });

    if (foundEmployeeByEmail) {
      return res.status(409).json({ message: "User already exists" });
    }

    const skillObjectReferences = await validateSkills(skillLevels);

    const employee = new Employee({
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      email: email,
      isActive: isActive,
      skillLevels: skillObjectReferences,
    });

    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const {
      error,
      value: { firstName, lastName, dob, email, isActive, skillLevels },
    } = validateEmployee(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const employeeToUpdate = res.employee;

    if (firstName) {
      employeeToUpdate.firstName = firstName;
    }

    if (lastName) {
      employeeToUpdate.lastName = lastName;
    }

    if (dob) {
      employeeToUpdate.dob = dob;
    }

    if (email) {
      if (email !== employeeToUpdate.email) {
        const existingEmployeeEmail = await Employee.findOne({ email: email });
        if (existingEmployeeEmail) {
          return res
            .status(409)
            .json({ message: "Employee with this email already exists" });
        }
        employeeToUpdate.email = email;
      }
    }

    if (isActive !== undefined) {
      employeeToUpdate.isActive = isActive;
    }

    if (skillLevels) {
      employeeToUpdate.skillLevels = await validateSkills(skillLevels);
    }

    const updatedEmployee = await employeeToUpdate.save();
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    await res.employee.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted employee" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
