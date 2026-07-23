const Task = require("../models/Task");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
    try {

        // Validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            title,
            description,
            dueDate,
            priority,
            status,
            assignedTo,
        } = req.body;

        // Check required field
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        // Create Task
        const task = await Task.create(
            {
                title,
                description,
                dueDate,
                priority,
                status,
                assignedTo,
                createdBy: req.user._id, // Logged-in user
            }
        );

        res.status(201).json({
            success: true,
            message: "Task Created Successfully",
            task,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getTasks = async (req, res) => {
    try {

        const {status, priority, sortBy, order} = req.query;

        let filter = {};
        let sort = {};

        // Filter
        if(status){
            filter.status=status;
        }

        if(priority){
            filter.priority=priority;
        }

        // Sorting
        if(sortBy){
            sort[sortBy] = order === "desc"? -1 :1;
        }

        let tasks;

        //Admin
        if (req.user.role === "Admin") {
            tasks = await Task.find()
                .populate("createdBy", "username email role")
                .populate("assignedTo", "username email role");
        }

        // Manager
        else if (req.user.role === "Manager") {
            tasks = await Task.find({
                createdBy: req.user._id
            })
                .populate("createdBy", "username email role")
                .populate("assignedTo", "username email role");
        }

        // User
        else {
            tasks = await Task.find({
                assignedTo: req.user._id
            })
                .populate("createdBy", "username email role")
                .populate("assignedTo", "username email role");

        }

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("createdBy", "username email role")
            .populate("assignedTo", "username email role");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Admin can access everything
        if (req.user.role === "Admin") {
            return res.status(200).json({
                success: true,
                task,
            });
        }

        // Manager can access only tasks created by them
        if (req.user.role === "Manager" &&
            task.createdBy._id.toString() === req.user._id.toString()) {
            return status(200).json({
                success: true,
                task,
            });
        }

        // User can access only assigned task
        if (
            req.user.role === "User" &&
            task.assignedTo &&
            task.assignedTo._id.toString() === req.user._id.toString()
        ) {
            return res.status(200).json({
                success: true,
                task
            });
        }

        return res.status(403).json({
            success: false,
            message: "Access Denied"
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

exports.updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Admin will bypass this condition and direct updates
        if (req.user.role !== "Admin") {

            // Manager
            if (req.user.role === "Manager" &&
                task.createdBy.toString() !== req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied",
                });
            }

            // User
            if (req.user.role === "User" &&
                (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied"
                });
            }
        }

        // Assignment Validation
        if(req.body.assignedTo){

            const assignedUser = await User.findById(req.body.assignedTo);

            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: "Assigned user not found"
                });
            }

            // Admin cannot assign task to another Admin
            if(req.user.role === "Admin" &&
                assignedUser.role === "Admin"
            ){
                return res.status(403).json({
                    success: false,
                    message: "Admin cannot assign tasks to another Admin"
                });
            }

            // Manager can assign only to Users
            if (
                req.user.role === "Manager" &&
                (assignedUser.role === "Admin" ||
                    assignedUser.role === "Manager")
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Manager can assign tasks only to Users"
                });
            }
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate("createdBy", "username email role")
            .populate("assignedTo", "username email role");

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        // Admin can delete any task
        if (req.user.role === " Admin") {
            // No Permission check
        }

        // Managar can delete only tasks created by them
        else if (req.user.role === "Manager") {

            if (task.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied",
                });
            }
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAssignedTasks = async (req,res) =>{
    try {
        console.log(req.user._id);
        const tasks = await Task.find({
            assignedTo:req.user._id
        })
        .populate("createdBy", "username email role")
        .populate("assignedTo", "username email role");

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}