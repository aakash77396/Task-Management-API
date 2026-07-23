const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
    registerUser,
    loginUser,
    logoutUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const {loginLimiter} = require("../middleware/rateLimiter");

router.post("/register",
    [
        body("username")
            .notEmpty()
            .withMessage("Username is required"),

        body("email")
            .isEmail()
            .withMessage("Please enter a valid email"),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    registerUser
);

router.post("/login",
    loginLimiter,
    [
        body("email")
            .isEmail()
            .withMessage("Valid email is required"),

        body("password")
            .notEmpty()
            .withMessage("Password is required"),
    ]
    , loginUser);


router.get("/admin", authMiddleware, roleMiddleware("Admin"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin",
    });
},
);

router.get("/manager", authMiddleware, roleMiddleware("Admin","Manager"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Manager",
    });
},
);

router.get("/user", authMiddleware, roleMiddleware("Admin","Manager","User"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome User",
    });
},
);

router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
