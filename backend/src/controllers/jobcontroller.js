const pool = require("../config/db");
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require("../models/jobmodel");

const createJobPost = async (req, res) => {
    try {
        const {
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

        const companyResult = await pool.query(
            "SELECT id, recruiter_id FROM companies WHERE id = $1",
            [companyId]
        );

        if (companyResult.rows.length === 0) {
            return res.status(404).json({
                message: "Company not found with the provided company ID"
            });
        }

        if (companyResult.rows[0].recruiter_id !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to post jobs for this company"
            });
        }

        const job = await createJob({
            recruiterId: req.user.id,
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
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create Job Error:", error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const { search, location, jobType, companyId } = req.query;

        const filters = {};
        if (search) filters.search = search;
        if (location) filters.location = location;
        if (jobType) filters.jobType = jobType;
        if (companyId) filters.companyId = companyId;

        const jobs = await getJobs(filters);

        res.status(200).json({
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get All Jobs Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getSingleJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await getJobById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            job
        });

    } catch (error) {
        console.error("Get Single Job Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateJobPost = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await updateJob(
            jobId,
            req.user.id,
            req.body
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you are not authorized to update this job"
            });
        }

        res.status(200).json({
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update Job Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteJobPost = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await deleteJob(
            jobId,
            req.user.id
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you are not authorized to delete this job"
            });
        }

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete Job Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createJobPost,
    getAllJobs,
    getSingleJob,
    updateJobPost,
    deleteJobPost
};