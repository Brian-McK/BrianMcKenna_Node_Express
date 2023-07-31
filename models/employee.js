const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          const today = new Date();
          const ageLimit = new Date(today);
          ageLimit.setFullYear(today.getFullYear() - 18);

          return value <= ageLimit;
        },
        message: "Must be at least 18 years old",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
    isActive: {
      type: Boolean,
      required: [true, "Active or not is required"],
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
