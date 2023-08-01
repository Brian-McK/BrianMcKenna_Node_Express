const Joi = require("joi");

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .regex(/^(?=.*[A-Z])(?=.*[\W_]).*$/)
      .pattern(/^[a-zA-Z0-9\W_]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "password must contain at least 1 uppercase letter and 1 special character",
        "string.min": "password must be at least {#limit} characters long",
      }),
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
