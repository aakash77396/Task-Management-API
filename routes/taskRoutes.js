const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createTask,
    getTasks,
    getTaskById,
    deleteTask,
    updateTask
} = require("../controllers/taskController");

router.post("/", authMiddleware, roleMiddleware("Admin", "Manager"),
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

router.get("/", authMiddleware, getTasks);

router.get("/:id", authMiddleware, getTaskById);

router.put("/:id", authMiddleware,
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

router.delete("/:id", authMiddleware, roleMiddleware("Admin", "Manager"), deleteTask);

module.exports = router;
