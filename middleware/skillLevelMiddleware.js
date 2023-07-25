const SkillLevel = require("../models/skillLevel");

async function getSkillLevel(req, res, next) {
  let skillLevel;

  try {
    skillLevel = await SkillLevel.findById(req.params.id);

    if (skillLevel == null) {
      return res.status(404).json({ message: "Can't find skill Level" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.skillLevel = skillLevel;
  next();
}

module.exports = { getSkillLevel };
