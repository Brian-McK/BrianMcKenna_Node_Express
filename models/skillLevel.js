const mongoose = require("mongoose");
const Employee = require("../models/employee");

const skillLevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-middleware to remove references to the deleted SkillLevel in Employee documents
skillLevelSchema.pre(
  "deleteOne",
  { query: true, document: false },
  async function (next) {
    try {
      const deletedSkillLevelId = this.getQuery()._id;
      const employeesToUpdate = await Employee.find({
        skillLevels: { $in: [deletedSkillLevelId] },
      }).exec();

      const updates = employeesToUpdate.map(async (employee) => {
        if (employee.skillLevels.includes(deletedSkillLevelId)) {
          employee.skillLevels.pull(deletedSkillLevelId);
          await employee.save();
        }
      });

      await Promise.all(updates);
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mongoose.model("SkillLevel", skillLevelSchema);
