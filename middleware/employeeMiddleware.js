const Employee = require("../models/employee");
const { Types } = require("mongoose");

async function getEmployee(req, res, next) {
  try {
    const id = req.params.id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const employee = await Employee.findById(id);

    if (employee == null) {
      return res.status(404).json({ message: "Can't find employee" });
    }

    res.employee = employee;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getEmployee };
