const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const { authLimiter } = require("../middleware/ratelimitmiddleware");
const { register, login, getCurrentUser, logout } = require("../controllers/authcontroller");
const { validateRegister, validateLogin } = require("../validators/authvalidator");

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logout);

module.exports = router;