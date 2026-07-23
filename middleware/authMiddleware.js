const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistToken = require("../models/blacklistTokenModel");

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });
        }

        // Check Blacklisted Token
        const blacklistedToken = await BlacklistToken.findOne({token});

        if (blacklistedToken) {
            return res.status(401).json({
                success: false,
                message: "Token has been invalidated. Please login again."
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get User
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or Expired Token",
        });
    }
};

module.exports = authMiddleware;
