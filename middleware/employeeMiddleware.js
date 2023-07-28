const Employee = require("../models/employee");

async function getEmployee(req, res, next) {
  let employee;

  try {
    employee = await Employee.findById(req.params.id);

    if (employee == null) {
      return res.status(404).json({ message: "Can't find employee" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.employee = employee;
  next();
}

async function calculateAge(next) {
  const dob = this.dob;
  if (dob) {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  next();
}

module.exports = { getEmployee, calculateAge };
