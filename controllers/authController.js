const User = require("../models/User");
const BlacklistToken = require("../models/blacklistTokenModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator");

const sendEmail = require("../utils/sendEmail");


exports.registerUser = async (req, res) => {
    try {
        // Validation Errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            })
        };

        const { username, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Send Welcome Email
        try {
            await sendEmail(
            user.email,
            "Welcome to Task Management System",
            `Hello ${user.username},
            Welcome to the Task Management System.
            Your account has been created successfully.
            Regards,
            Task Management Team`
        );
        } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message,
            });
        }

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        try {
            await sendEmail(
                user.email,
                "Login Alert",
                `Hello ${user.username},
                Your account was successfully logged in.`
            );
        } catch (err) {
            console.log("Email Error:", err.message);
        }

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.logoutUser = async (req, res) => {
    try {

        const token = req.header("Authorization").replace("Bearer ", "");

        const decoded = jwt.decode(token);

        await BlacklistToken.create({
            token,
            expiresAt: new Date(decoded.exp*1000)
        });
        
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};