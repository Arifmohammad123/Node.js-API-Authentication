const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');



router.post('/register', async (req, res) => {
    
    // Validating Data before inserting user data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Checking if user already exist
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email Already Exist");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    // Validating Data before inserting user data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Checking if email exist
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) return res.status(400).send("Email doesn't exist");
    // Password is correct
    const validatePass = await bcrypt.compare(req.body.password, userExist.password);
    if (!validatePass) return res.status(400).send("Email or password is wrong");

    // Create and assign token
    const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;