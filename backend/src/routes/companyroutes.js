const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");
const { uploadLogo } = require("../middleware/uploadmiddleware");
const {
    validateCreateCompany,
    validateUpdateCompany
} = require("../validators/companyvalidator");

const { createCompanyProfile, getMyCompany, updateMyCompany } = require("../controllers/companycotroller");

router.post("/createcompany", authMiddleware, roleMiddleware("recruiter"), uploadLogo.single("logo"), validateCreateCompany, createCompanyProfile);
router.get("/getcompany", authMiddleware, roleMiddleware("recruiter"), getMyCompany);
router.put("/updatecompany", authMiddleware, roleMiddleware("recruiter"), uploadLogo.single("logo"), validateUpdateCompany, updateMyCompany);

module.exports = router;