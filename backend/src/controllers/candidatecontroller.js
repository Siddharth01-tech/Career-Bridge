const {createProfile,getProfile,updateProfile} = require('../models/candidateporfilemodel')

const {createFile}=require("../models/filemodel");
const{uploadFile}=require("../services/storageservice");

const normalizeSkills = (skills) => {

    if (!skills) {
        return null;
    }

    if (Array.isArray(skills)) {
        return skills;
    }

    return skills
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);
};

const createCandidateProfile = async (req, res) => {
    try {
        const {phone,skills,education,experience,location,bio} = req.body;

        let resumeId = null;

        if (req.file) {
            const uploadResult = await uploadFile(
                req.file,
                "job-portal/resumes"
            );

            const file = await createFile(
                req.user.id,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                uploadResult.url,
                uploadResult.fileId
            );

            resumeId = file.id;
        }

        const profile = await createProfile(
            req.user.id,
            phone || null,
            normalizeSkills(skills),
            education || null,
            experience ? Number(experience) : null,
            location || null,
            bio || null,
            resumeId
        );

        res.status(201).json({
            message: "Profile created successfully",
            profile
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getCandidateProfile = async (req, res) => {
    try {
        const profile = await getProfile(req.user.id);

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json(profile);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateCandidateProfile = async (req, res) => {
    try {
        const {phone,skills,education,experience,location,bio} = req.body;
        let resumeId = null;

        if (req.file) {
            const uploadResult = await uploadFile(
                req.file,
                "job-portal/resumes"
            );

            const file = await createFile(
                req.user.id,
                req.file.originalname,
                req.file.mimetype,
                req.file.size,
                uploadResult.url,
                uploadResult.fileId
            );

            resumeId = file.id;
        }
        const profile = await updateProfile(
            req.user.id,
            phone,
            skills,
            education,
            experience,
            location,
            bio,
            resumeId
        );

        res.json({
            message: "Profile updated successfully",
            profile
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createCandidateProfile,
    getCandidateProfile,
    updateCandidateProfile
};