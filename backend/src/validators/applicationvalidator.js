const validateApplyJob = (req, res, next) => {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
        return res.status(400).json({
            message: "Job ID is required"
        });
    }

    if (isNaN(Number(jobId)) || !Number.isInteger(Number(jobId)) || Number(jobId) <= 0) {
        return res.status(400).json({
            message: "Job ID must be a valid positive integer"
        });
    }

    req.body.jobId = parseInt(jobId, 10);
    if (coverLetter && typeof coverLetter === "string") {
        req.body.coverLetter = coverLetter.trim();
    }

    next();
};

module.exports = {
    validateApplyJob
};
