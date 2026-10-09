const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const { validateAdminIdParam } = require("../validators/adminvalidator");

const {
    getUsers,
    getUser,
    blockUserAccount,
    unblockUserAccount,
    getJobs,
    removeJob
} = require("../controllers/admincontroller");

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/users", getUsers);
router.get("/users/:id", validateAdminIdParam, getUser);
router.put("/users/:id/block", validateAdminIdParam, blockUserAccount);
router.put("/users/:id/unblock", validateAdminIdParam, unblockUserAccount);
router.get("/jobs", getJobs);
router.delete("/jobs/:id", validateAdminIdParam, removeJob);

module.exports = router;