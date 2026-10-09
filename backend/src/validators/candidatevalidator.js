const validateCandidateProfile = (req, res, next) => {
    const { phone, skills, education, experience, location, bio } = req.body;

    if (experience !== undefined && experience !== null && experience !== "") {
        const exp = Number(experience);
        if (isNaN(exp) || !Number.isInteger(exp) || exp < 0) {
            return res.status(400).json({
                message: "Experience must be a non-negative integer (in years)"
            });
        }
        req.body.experience = exp;
    }

    if (phone && typeof phone === "string") {
        req.body.phone = phone.trim();
    }

    if (education && typeof education === "string") {
        req.body.education = education.trim();
    }

    if (location && typeof location === "string") {
        req.body.location = location.trim();
    }

    if (bio && typeof bio === "string") {
        req.body.bio = bio.trim();
    }

    next();
};

module.exports = {
    validateCandidateProfile
};
