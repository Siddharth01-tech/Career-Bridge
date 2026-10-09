const validateJobId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            message: "Invalid job ID. Job ID must be a positive integer."
        });
    }

    req.params.id = parseInt(id, 10);
    next();
};

const parseSkills = (skills) => {
    if (!skills) return null;
    if (Array.isArray(skills)) {
        const cleaned = skills.map(s => (typeof s === "string" ? s.trim() : String(s))).filter(Boolean);
        return cleaned.length > 0 ? cleaned : null;
    }
    if (typeof skills === "string") {
        const cleaned = skills.split(",").map(s => s.trim()).filter(Boolean);
        return cleaned.length > 0 ? cleaned : null;
    }
    return null;
};

const validateCreateJob = (req, res, next) => {
    let {
        companyId,
        title,
        description,
        location,
        jobType,
        salaryMin,
        salaryMax,
        skills,
        experience,
        deadline
    } = req.body;

    // Required fields check
    if (!companyId) {
        return res.status(400).json({
            message: "Company ID is required"
        });
    }

    if (isNaN(Number(companyId)) || !Number.isInteger(Number(companyId)) || Number(companyId) <= 0) {
        return res.status(400).json({
            message: "Company ID must be a valid positive integer"
        });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "Job title is required"
        });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
            message: "Job description is required"
        });
    }

    if (!jobType || typeof jobType !== "string" || !jobType.trim()) {
        return res.status(400).json({
            message: "Job type is required"
        });
    }

    // Numerical and range validations
    let numSalaryMin = null;
    let numSalaryMax = null;

    if (salaryMin !== undefined && salaryMin !== null && salaryMin !== "") {
        numSalaryMin = Number(salaryMin);
        if (isNaN(numSalaryMin) || numSalaryMin < 0) {
            return res.status(400).json({
                message: "Minimum salary must be a valid non-negative number"
            });
        }
    }

    if (salaryMax !== undefined && salaryMax !== null && salaryMax !== "") {
        numSalaryMax = Number(salaryMax);
        if (isNaN(numSalaryMax) || numSalaryMax < 0) {
            return res.status(400).json({
                message: "Maximum salary must be a valid non-negative number"
            });
        }
    }

    if (numSalaryMin !== null && numSalaryMax !== null && numSalaryMin > numSalaryMax) {
        return res.status(400).json({
            message: "Minimum salary cannot be greater than maximum salary"
        });
    }

    let numExperience = null;
    if (experience !== undefined && experience !== null && experience !== "") {
        numExperience = Number(experience);
        if (isNaN(numExperience) || !Number.isInteger(numExperience) || numExperience < 0) {
            return res.status(400).json({
                message: "Experience must be a non-negative integer (in years)"
            });
        }
    }

    let formattedDeadline = null;
    if (deadline !== undefined && deadline !== null && deadline !== "") {
        const parsedDate = new Date(deadline);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: "Deadline must be a valid date (e.g. YYYY-MM-DD)"
            });
        }
        formattedDeadline = deadline;
    }

    // Attach sanitized values to req.body
    req.body.companyId = parseInt(companyId, 10);
    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.location = location ? location.trim() : null;
    req.body.jobType = jobType.trim();
    req.body.salaryMin = numSalaryMin;
    req.body.salaryMax = numSalaryMax;
    req.body.skills = parseSkills(skills);
    req.body.experience = numExperience;
    req.body.deadline = formattedDeadline;

    next();
};

const validateUpdateJob = (req, res, next) => {
    const {
        title,
        description,
        location,
        jobType,
        salaryMin,
        salaryMax,
        skills,
        experience,
        deadline
    } = req.body;

    const hasAnyField = [
        title,
        description,
        location,
        jobType,
        salaryMin,
        salaryMax,
        skills,
        experience,
        deadline
    ].some(field => field !== undefined);

    if (!hasAnyField) {
        return res.status(400).json({
            message: "At least one field is required to update job"
        });
    }

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Job title cannot be empty"
            });
        }
        req.body.title = title.trim();
    }

    if (description !== undefined) {
        if (typeof description !== "string" || !description.trim()) {
            return res.status(400).json({
                message: "Job description cannot be empty"
            });
        }
        req.body.description = description.trim();
    }

    if (jobType !== undefined) {
        if (typeof jobType !== "string" || !jobType.trim()) {
            return res.status(400).json({
                message: "Job type cannot be empty"
            });
        }
        req.body.jobType = jobType.trim();
    }

    if (location !== undefined) {
        req.body.location = location ? location.trim() : null;
    }

    let numSalaryMin = undefined;
    let numSalaryMax = undefined;

    if (salaryMin !== undefined) {
        if (salaryMin === null || salaryMin === "") {
            req.body.salaryMin = null;
        } else {
            numSalaryMin = Number(salaryMin);
            if (isNaN(numSalaryMin) || numSalaryMin < 0) {
                return res.status(400).json({
                    message: "Minimum salary must be a valid non-negative number"
                });
            }
            req.body.salaryMin = numSalaryMin;
        }
    }

    if (salaryMax !== undefined) {
        if (salaryMax === null || salaryMax === "") {
            req.body.salaryMax = null;
        } else {
            numSalaryMax = Number(salaryMax);
            if (isNaN(numSalaryMax) || numSalaryMax < 0) {
                return res.status(400).json({
                    message: "Maximum salary must be a valid non-negative number"
                });
            }
            req.body.salaryMax = numSalaryMax;
        }
    }

    if (numSalaryMin !== undefined && numSalaryMax !== undefined && numSalaryMin > numSalaryMax) {
        return res.status(400).json({
            message: "Minimum salary cannot be greater than maximum salary"
        });
    }

    if (experience !== undefined) {
        if (experience === null || experience === "") {
            req.body.experience = null;
        } else {
            const numExperience = Number(experience);
            if (isNaN(numExperience) || !Number.isInteger(numExperience) || numExperience < 0) {
                return res.status(400).json({
                    message: "Experience must be a non-negative integer (in years)"
                });
            }
            req.body.experience = numExperience;
        }
    }

    if (skills !== undefined) {
        req.body.skills = parseSkills(skills);
    }

    if (deadline !== undefined) {
        if (deadline === null || deadline === "") {
            req.body.deadline = null;
        } else {
            const parsedDate = new Date(deadline);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    message: "Deadline must be a valid date (e.g. YYYY-MM-DD)"
                });
            }
            req.body.deadline = deadline;
        }
    }

    next();
};

module.exports = {
    validateJobId,
    validateCreateJob,
    validateUpdateJob
};
