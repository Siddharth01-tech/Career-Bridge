const pool = require("../config/db");

const createProfile = async (
    userId,
    phone,
    skills,
    education,
    experience,
    location,
    bio,
    resumeId
) => {
    const result = await pool.query(
        `INSERT INTO candidate_profiles
        (
            user_id,
            phone,
            skills,
            education,
            experience,
            location,
            bio,
            resume_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
            userId,
            phone,
            skills,
            education,
            experience,
            location,
            bio,
            resumeId
        ]
    );

    return result.rows[0];
};

const getProfile = async (userId) => {
    const result = await pool.query(
        `SELECT
            cp.*,
            f.file_name AS resume_name,
            f.file_type AS resume_type,
            f.file_size AS resume_size,
            f.file_url AS resume_url,
             f.storage_public_id AS resume_file_id
         FROM candidate_profiles cp
         LEFT JOIN files f
            ON cp.resume_id = f.id
         WHERE cp.user_id = $1`,
        [userId]
    );

    return result.rows[0];
};

const updateProfile = async (
    userId,
    phone,
    skills,
    education,
    experience,
    location,
    bio,
    resumeId
) => {
    const result = await pool.query(
        `UPDATE candidate_profiles
         SET
            phone = $1,
            skills = $2,
            education = $3,
            experience = $4,
            location = $5,
            bio = $6,
            updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $7
         RETURNING *`,
        [
            phone,
            skills,
            education,
            experience,
            location,
            bio,
            userId
        ]
    );

    return result.rows[0];
};

const getResumeIdByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT resume_id
         FROM candidate_profiles
         WHERE user_id = $1`,
        [userId]
    );

    return result.rows[0]?.resume_id;
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    getResumeIdByUserId
};