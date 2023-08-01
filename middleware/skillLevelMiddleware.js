const SkillLevel = require("../models/skillLevel");
const { Types } = require("mongoose");

async function getSkillLevel(req, res, next) {
  try {
    const id = req.params.id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Skill Level ID" });
    }

    const skillLevel = await SkillLevel.findById(req.params.id);

    if (skillLevel == null) {
      return res.status(404).json({ message: "Can't find skill Level" });
    }

    res.skillLevel = skillLevel;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getSkillLevel };