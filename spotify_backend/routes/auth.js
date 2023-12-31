const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

//This POST route will help to register a user.
router.post("/register", async (req, res) => {
    //This code is run when the /register api is called as aPOST request

    //My req.body will be of the format {email, password, firstName, lastName, username}
    const { email, password, firstName, lastName, username } = req.body;

    //step 2: Does a user with this email already exist? If yes, we throw an error.
    const user = await User.findOne({ email: email });
    if (user) {
        return res.
            status(403)
            .json({ error: "A user with this email already exists" });
    }
    //This is a valid request
    // step 3: Create a new user in the DB
    // step 3.1 : We do not store password in plane text
    // xyz : We convert the plane text password to a hash.
    // suppose xyz(original password) --> vjytsrhjb5675879ytdgcjhgi(corresponding hash value of original password)
    // let My hash of xyz depends on 2 parameters.
    // If I keep those 2 parameters same, xyz ALWAYS gives the same hash.
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
    };
    const newUser = await User.create(newUserData);
    console.log(newUserData);

    // step 4 : We want to create the token to return to the user.
    const token = await getToken(email, newUser);

    // step 5: Return the result to the user
    const userToReturn = { ...newUser.toJSON(), token };
    console.log(userToReturn);
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
    // step 1: Get email and password sent by user from req.body.
    const { email, password } = req.body;

    // step 2: Check if user with given email exists. If not, the credentials are invalid.
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(403).json({ err: "Invalid Credentials!" });
    }

    console.log(user);
    // Step 3: If the user exists, check if the password is correct. If not, then the credentials are invalid.
    //This is a tricky step. why? Beacause we have stored the original password in a hash form, which we cannot use to get back the password.
    // I cannot do : if(password == user.password)
    // bcrypt.compare enabled us to compare 1 password in planetext(password from req.body) to a hash password(the one in our db) securely.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // This will be true or false.
    if (!isPasswordValid) {
        return res.status(403).json({ err: "Invalid Credentials!" });
    }

    // step 4: If the credentials are correct return a token to the user.
    const token = await getToken(user.email, user);
    const userToReturn = { ...user.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports = router;