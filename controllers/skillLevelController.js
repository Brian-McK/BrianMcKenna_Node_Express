const SkillLevel = require("../models/skillLevel");

exports.getAllSkillLevels = async (req, res) => {
  try {
    const skillLevels = await SkillLevel.find();
    res.status(200).json(skillLevels);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getSkillLevelById = async (req, res) => {
  res.json(res.skillLevel);
};

exports.createSkillLevel = async (req, res) => {
  const skillLevel = new SkillLevel({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newSkillLevel = await skillLevel.save();
    console.log(newSkillLevel);
    res.status(201).json(newSkillLevel);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updateSkillLevel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const skillLevelToUpdate = res.skillLevel;

    if (name) {
      skillLevelToUpdate.name = name;
    }

    if (description) {
      skillLevelToUpdate.description = description;
    }

    const updatedSkillLevel = await skillLevelToUpdate.save();
    res.json(updatedSkillLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSkillLevel = async (req, res) => {
  try {
    await res.skillLevel.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted skill level" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
