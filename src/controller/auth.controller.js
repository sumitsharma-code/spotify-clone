const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
    const {username, email, password, role="user"} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })


    if(isUserAlreadyExists) {
        return res.status(422).json({
            message:"User Already Exists."
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role,
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
        message: "User Created Successfully.",
        user :{
            id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
        }
    })
}

async function loginUser(req, res) {
    const {username, email, password} = req.body;

    // check if user exists

    // if yes -> user variable will have all the details of user
    // if not -> user variable will return null
    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    // if user is null, return invalid
    if(!user) {
        return res.status(401).json({
            message:"Invalid Credentials",
        })
    }
    
    // if user exists, check if his password is right
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordValid) {
        return res.status(401).json({
            message:"Invalid Credentials",
        })
    }

    const token = jwt.sign({
        id:user._id,
        role: user.role,
    }, process.env.JWT_SECRET);

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully"
    })
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User Logged out successfully"
    })
}

module.exports = {registerUser, loginUser, logoutUser};