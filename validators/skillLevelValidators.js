const mongoose = require("mongoose");
const SkillLevel = require("../models/skillLevel");

async function validateSkills(skills) {
  if (!skills) {
    return [];
  }

  for (const skillId of skills) {
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      throw new Error(`Invalid skill ID format: ${skillId}`);
    }
  }

  const existingSkills = await SkillLevel.find({ _id: { $in: skills } });

  if (existingSkills.length !== skills.length) {
    throw new Error("One or more skills do not exist");
  }

  return existingSkills.map((skill) => skill._id);
}

module.exports = { validateSkills };
