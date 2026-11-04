const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
            message: "Password is required and must be at least 6 characters long"
        });
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@careerbridge.com").toLowerCase().trim();

    if (cleanEmail === adminEmail) {
        req.body.role = "admin";
    } else {
        const publicRoles = ["candidate", "recruiter"];
        if (role && !publicRoles.includes(role)) {
            return res.status(400).json({
                message: "Role must be one of: candidate, recruiter"
            });
        }
        req.body.role = role || "candidate";
    }

    req.body.name = name.trim();
    req.body.email = cleanEmail;

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        });
    }

    if (!password || typeof password !== "string" || !password.trim()) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    req.body.email = email.trim().toLowerCase();

    next();
};

module.exports = {
    validateRegister,
    validateLogin
};
