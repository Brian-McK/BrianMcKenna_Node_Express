const Joi = require("joi");

const validateSkillLevel = (skillLevel) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    name: Joi.string().min(3).max(255).required(),
  }).options({
    errors: {
      wrap: {
        label: false,
      },
    },
  });

  return schema.validate(skillLevel);
};

module.exports.validateSkillLevel = validateSkillLevel;
