const Joi = require("joi");
const jwt = require("jsonwebtoken");

//validating registration
const registerValidation = (data) => {
    const schema = Joi.object(
        {
            name: Joi.string().min(6).max(255).required(),
            email: Joi.string().min(6).max(255).required(),
            password: Joi.string().min(6).max(255).required()
        }
    );
    return schema.validate(data);
}
//validating Login
const loginValidation = (data) => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).max(255).required(),
            password: Joi.string().min(6).max(255).required()
        }
    );
    return schema.validate(data);
}

// to varify token
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token"); // Corrected "auth-tocken" to "auth-token"
    if (!token) return res.status(401).json({ error: "Access denied." });

    try {
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (error) {
        res.status(400).json({ error: "Token is not valid" });
    }
};

module.exports = { registerValidation, loginValidation, verifyToken }