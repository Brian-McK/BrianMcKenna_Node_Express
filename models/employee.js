const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
