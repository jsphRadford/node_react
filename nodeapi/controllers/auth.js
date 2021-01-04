const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

exports.signup = async (req, res) => {
    const userExisits = await User.findOne({email: req.body.email})
    if(userExisits) return res.status(403).json({
        error: "Email is taken!"
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: "Signup Successful! " });

};

exports.signin = (req, res) => {
    //Find the user based on email in DB
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        // if err or no user
        if(err || !user){
            return res.status(401).json({
                error: "User with that email doesn't exist. Please signin."
            })
        }
        //If user, make sure the email and password match

        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }
        //Generate a token with user ID and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

        //Persist the token as 't' in cookie with expiration date
        res.cookie("t", token, {expire: new Date() + 9999});

        //Return response with user and token to frontend client
        const {_id, name, email} = user;
        return res.json({token, user: {_id, email, name} });


    });
};

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({message: "Signout success!"});
};

exports.requireSignin = expressJwt({
    //If the token is valid, express jwt appends the verified users ID
    //  in an auth key to the request object
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
});