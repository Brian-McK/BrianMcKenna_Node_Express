const Joi = require("joi");

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(6).max(30).required(),
  }).options({
    errors: {
      wrap: {
        label: false,
      },
    },
  });

  return schema.validate(user);
};

module.exports.validateUser = validateUser;
