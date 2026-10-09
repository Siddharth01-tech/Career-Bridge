const {createCompany,getCompanyByRecruiter,updateCompany} = require("../models/companymodel");
const {createFile}=require("../models/filemodel");
const {uploadFile}=require("../services/storageservice");

const createCompanyProfile = async (req, res) => {
    try {
        const {companyName,description,website,location,industry} = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }
        let logoId = null;

        if (req.file) {
            const uploadResult = await uploadFile(
                req.file,
                "job-portal/company-logos"
            );

            const file = await createFile(
                req.user.id,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                uploadResult.url,
                uploadResult.fileId
            );

            logoId = file.id;
        }

        const company = await createCompany(
            req.user.id,
            companyName,
            description,
            website,
            location,
            industry,
            logoId
        );

        res.status(201).json({
            message: "Company created successfully",
            company
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getMyCompany = async (req, res) => {
    try {
        const company = await getCompanyByRecruiter(
            req.user.id
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.json(company);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateMyCompany = async (req, res) => {
    try {
        const {
            companyName,
            description,
            website,
            location,
            industry
        } = req.body;

        let logoId = null;

        if (req.file) {
            const uploadResult = await uploadFile(
                req.file,
                "job-portal/company-logos"
            );

            const file = await createFile(
                req.user.id,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                uploadResult.url,
                uploadResult.fileId
            );

            logoId = file.id;
        }

        const company = await updateCompany(
            req.user.id,
            companyName,
            description,
            website,
            location,
            industry,
            logoId
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.json({
            message: "Company updated successfully",
            company
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createCompanyProfile,
    getMyCompany,
    updateMyCompany
};