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

module.exports = { getEmployee };
