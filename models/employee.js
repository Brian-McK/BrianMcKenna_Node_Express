const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
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
    },
  },
  { timestamps: true }
);

function calculateAge() {
  const dob = this.dob;
  if (dob) {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

employeeSchema.pre("save", calculateAge);

module.exports = mongoose.model("Employee", employeeSchema);
