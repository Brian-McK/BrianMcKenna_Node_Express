const mongoose = require("mongoose");

const skillLevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      minlength: [3, "Skill name must be at least 3 characters long"],
      maxlength: [50, "Skill name must not exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [3, "Description must be at least 3 characters long"],
      maxlength: [100, "Description must not exceed 100 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkillLevel", skillLevelSchema);
