const Joi = require('joi');

const predictionSchema = Joi.object({
    firstName: Joi.string().min(2).max(100).required().trim(),
    lastName: Joi.string().min(2).max(100).required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().trim(),
    screenTimeHours: Joi.number().min(0).max(24).required(),
    nightUsageHours: Joi.number().min(0).max(24).required(),
    unlocksPerDay: Joi.number().integer().min(0).max(1000).required(),
    socialMediaHours: Joi.number().min(0).max(24).required(),
    productivityHours: Joi.number().min(0).max(24).required(),
});

const validatePrediction = (data) => {
    return predictionSchema.validate(data, { abortEarly: false });
};

module.exports = {
    validatePrediction,
};
