const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const {
    validateJobId,
    validateCreateJob,
    validateUpdateJob
} = require("../validators/jobvalidator");

const {
    createJobPost,
    getAllJobs,
    getSingleJob,
    updateJobPost,
    deleteJobPost
} = require("../controllers/jobcontroller");

router.get("/getalljob", getAllJobs);
router.get("/getajob/:id", validateJobId, getSingleJob);
router.post("/createjob", authMiddleware, roleMiddleware("recruiter"), validateCreateJob, createJobPost);
router.put("/updateajob/:id", authMiddleware, roleMiddleware("recruiter"), validateJobId, validateUpdateJob, updateJobPost);
router.delete("/deletejob/:id", authMiddleware, roleMiddleware("recruiter"), validateJobId, deleteJobPost);

module.exports = router;