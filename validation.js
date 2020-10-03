// validation
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    const validationStatus = schema.validate(data);
    return validationStatus;
};
const loginValidation = data => {
    const schema =Joi.object( {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    const validationStatus = schema.validate(data);
    return validationStatus;
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;