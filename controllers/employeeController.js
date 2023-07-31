const { validateSkills } = require("../validators/skillLevelValidators");
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
    const { firstName, lastName, dob, email, isActive, skills } = req.body;

    const foundEmployeeByEmail = await Employee.findOne({ email });

    if (foundEmployeeByEmail) {
      return res.status(409).json({ message: "User already exists" });
    }

    const skillObjectReferences = await validateSkills(skills);

    
    const employee = new Employee({
      firstName,
      lastName,
      dob,
      email,
      isActive,
      skillLevels: skillObjectReferences,
    });

    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.json({ message: errorOutput(error) });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const { firstName, lastName, dob, email, isActive, skills } = req.body;

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
      employeeToUpdate.email = email;
    }

    if (isActive !== undefined) {
      employeeToUpdate.isActive = isActive;
    }

    if (skills) {
      employeeToUpdate.skillLevels = await validateSkills(skills);
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

function errorOutput(error) {
  const messages = Object.values(error.message).map(
    (property) => property.message
  );

  return messages.join(", ");
}
