const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if(result.error) {
                return res.status(400).json(result.error);
            }

            if(!req.value) {req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    }, 

    schemas: {
        authSchema: Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            email: Joi.string().email().required(), 
            password: Joi.string().required()
        }),  
        loginSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
}