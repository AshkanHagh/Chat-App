import Joi from 'joi';

const validator = (schema : Joi.Schema) => (payload : object) => schema.validate(payload, {abortEarly : false});

const signupSchema = Joi.object({
    fullName : Joi.string().required(),
    username : Joi.string().required(),
    password : Joi.string().min(6).max(255).required(),
    confirmPassword : Joi.ref('password'),
    gender : Joi.string().required()
});

export const validateSignup = validator(signupSchema);


// completed soon!!!