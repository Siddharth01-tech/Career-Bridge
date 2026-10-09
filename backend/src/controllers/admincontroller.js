const { getAllUsers, getUserById, blockUser, unblockUser, getAllJobs, deleteJob } = require("../models/adminmodel");
const { delCache, delCachePattern } = require("../config/redis");

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const blockUserAccount = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Admin should not block himself
        if (userId === req.user.id) {
            return res.status(400).json({
                message: "Admin cannot block himself"
            });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updatedUser = await blockUser(userId);

        return res.status(200).json({
            message: "User blocked successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Block user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const unblockUserAccount = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updatedUser = await unblockUser(userId);

        return res.status(200).json({
            message: "User unblocked successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Unblock user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs();

        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs
        });
    } catch (error) {
        console.error("Get admin jobs error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const removeJob = async (req, res) => {
    try {
        const jobId = Number(req.params.id);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await deleteJob(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Invalidate Redis cache for this job and all job list queries
        await delCache(`job:${jobId}`);
        await delCachePattern("jobs:all*");

        return res.status(200).json({
            message: "Job deleted successfully",
            job
        });
    } catch (error) {
        console.error("Delete admin job error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    getUsers,
    getUser,
    blockUserAccount,
    unblockUserAccount,
    getJobs,
    removeJob
};