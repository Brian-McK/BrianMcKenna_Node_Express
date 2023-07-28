const mongoose = require("mongoose");
const { calculateAge } = require("../middleware/employeeMiddleware");

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
  age: {
    type: Number,
  },
  skillLevels: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillLevel",
      },
    ],
    CreatedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
});

employeeSchema.pre("save", calculateAge);

module.exports = mongoose.model("Employee", employeeSchema);
