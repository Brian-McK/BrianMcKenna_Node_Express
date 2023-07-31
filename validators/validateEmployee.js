const JoiBase = require("joi");
const JoiDate = require("@joi/date");
const Joi = JoiBase.extend(JoiDate);

const validateEmployee = (employee) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().max(50).required(),
    dob: Joi.date().less("now").format("YYYY-MM-DD").required(),
    email: Joi.string().email().required(),
    isActive: Joi.boolean().required(),
    age: Joi.number(),
    skillLevels: Joi.array().items(Joi.string().alphanum()),
  }).options({
    errors: {
      wrap: {
        label: false,
      },
    },
  });

  return schema.validate(employee);
};

module.exports.validateEmployee = validateEmployee;
