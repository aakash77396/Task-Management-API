const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {getProfile} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, getProfile);

module.exports = router;
