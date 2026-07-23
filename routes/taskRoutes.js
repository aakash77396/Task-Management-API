const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {writeLimiter,readLimiter} = require("../middleware/rateLimiter");

const {
    createTask,
    getTasks,
    getTaskById,
    deleteTask,
    updateTask,
    getAssignedTasks
} = require("../controllers/taskController");
const { default: rateLimit } = require("express-rate-limit");

// createTask
router.post("/", authMiddleware, writeLimiter, roleMiddleware("Admin", "Manager"),
    [
        body("title")
            .notEmpty()
            .withMessage("Title is required"),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string")
            .trim()
            .isLength({ max: 500 })
            .withMessage("Description cannot exceed 500 characters"),

        body("priority")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Priority must be Low, Medium or High"),

        body("status")
            .optional()
            .isIn(["Pending", "In Progress", "Completed"])
            .withMessage("Invalid status"),

        body("dueDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),
    ],
    createTask,
);

// getTasks
router.get("/", authMiddleware, readLimiter, getTasks);

// Check assigned task
router.get("/assigned",authMiddleware,readLimiter,getAssignedTasks) 

// getTaskById
router.get("/:id", authMiddleware, readLimiter, getTaskById);

// updateTask
router.put("/:id", authMiddleware, writeLimiter,
    [
        body("title")
            .optional()
            .notEmpty()
            .withMessage("Title cannot be empty"),

        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string"),

        body("priority")
            .optional()
            .isIn(["Low", "Medium", "High"])
            .withMessage("Priority must be Low, Medium or High"),

        body("status")
            .optional()
            .isIn(["Pending", "In Progress", "Completed"])
            .withMessage("Invalid status"),

        body("dueDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),
    ],
    updateTask,
);

// deleteTask
router.delete("/:id", authMiddleware, writeLimiter, roleMiddleware("Admin", "Manager"), deleteTask);




module.exports = router;
