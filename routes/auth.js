const router = require("express").Router();
const User = require("../models/user");
const {registerValidation,loginValidation} = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register a user
// Assuming registerValidation and User model are correctly imported

router.post("/register", async (req, res) => {
    try {
        // Validate user input
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the email already exists
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).json({ error: "Email already exists." });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create and save the new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        const savedUser = await user.save();

        // Respond with the user ID to confirm registration
        res.json({ userId: savedUser._id });
    } catch (error) {
        // Generic error handling for unexpected errors
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});


// Login
router.post("/login", async (req, res) => {
    try {
     const { error } = loginValidation(req.body);
     if (error) {
         return res.status(400).json({ error: error.details[0].message });
     }
 
     // Check if user exists
     const user = await User.findOne({ email: req.body.email });
     if (!user) {
         return res.status(400).json({ error: "Email does not exist." });
     }
 
     // Check password
     const validPassword = await bcrypt.compare(req.body.password, user.password);
     if (!validPassword) {
         return res.status(400).json({ error: "Invalid password." });
     }
 
     // Create authentication token
     const token = jwt.sign(
         { name: user.name, id: user._id },
         process.env.TOKEN_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_IN }
     );
 
     // Attach token to header and send response
     res.header("auth-token", token).json({ error: null, data: { userId: user._id, token: token } });
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login.', details: error.message });
    }
 });
 

module.exports = router;