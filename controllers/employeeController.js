const Employee = require("../models/employee");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Get one employee by ID
exports.getEmployeeById = async (req, res) => {
  res.json(res.employee);
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  const employee = new Employee({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    email: req.body.email,
    isActive: req.body.isActive,
  });

  try {
    const newEmployee = await employee.save();
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
    try {
      const { firstName, lastName, dob, email, isActive } = req.body;
      const employeeToUpdate = res.employee;
  
      // Update the employee properties if they exist in the request body
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
  
      const updatedEmployee = await employeeToUpdate.save();
      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    await res.employee.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted employee" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
