const SkillLevel = require("../models/skillLevel");
const { validateSkillLevel } = require("../validators/validateSkillLevel");

exports.getAllSkillLevels = async (req, res) => {
  try {
    const skillLevels = await SkillLevel.find();
    res.status(200).json(skillLevels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSkillLevelById = async (req, res) => {
  res.json(res.skillLevel);
};

exports.createSkillLevel = async (req, res) => {
  try {
    const {
      error,
      value: { name, description },
    } = validateSkillLevel(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const foundSkillLevelByName = await SkillLevel.findOne({
      name: name,
    });

    if (foundSkillLevelByName) {
      return res.status(409).json({ message: "Skill level already exists" });
    }

    const skillLevel = new SkillLevel({
      name: name,
      description: description,
    });

    const newSkillLevel = await skillLevel.save();
    res.status(201).json(newSkillLevel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkillLevel = async (req, res) => {
  try {
    const {
      error,
      value: { name, description },
    } = validateSkillLevel(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const skillLevelToUpdate = res.skillLevel;

    if (name) {
      if (name !== skillLevelToUpdate.name) {
        const existingSkillLevelName = await SkillLevel.findOne({ name: name });
        if (existingSkillLevelName) {
          return res
            .status(409)
            .json({ message: "Skill level with this name already exists" });
        }
        skillLevelToUpdate.name = name;
      }
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
    await SkillLevel.deleteOne({ _id: res.skillLevel.id });
    res.json({ message: "Deleted skill level" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
