const pool = require("../config/db");

const getAllUsers = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            role,
            is_blocked,
            created_at,
            updated_at
        FROM users
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};

const getUserById = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            role,
            is_blocked,
            created_at,
            updated_at
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0];
};

const blockUser = async (userId) => {
    const result = await pool.query(
        `
        UPDATE users
        SET
            is_blocked = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
            id,
            name,
            email,
            role,
            is_blocked,
            updated_at
        `,
        [userId]
    );

    return result.rows[0];
};


const unblockUser = async (userId) => {
    const result = await pool.query(
        `
        UPDATE users
        SET
            is_blocked = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
            id,
            name,
            email,
            role,
            is_blocked,
            updated_at
        `,
        [userId]
    );

    return result.rows[0];
};

// Get all jobs
const getAllJobs = async () => {
    const result = await pool.query(
        `
        SELECT
            j.*,
            c.company_name,
            u.name AS recruiter_name
        FROM jobs j
        JOIN companies c
            ON j.company_id = c.id
        JOIN users u
            ON j.recruiter_id = u.id
        ORDER BY j.created_at DESC
        `
    );

    return result.rows;
};

const deleteJob = async (jobId) => {
    const result = await pool.query(
        `
        DELETE FROM jobs
        WHERE id = $1
        RETURNING *
        `,
        [jobId]
    );

    return result.rows[0];
};

module.exports = {
    getAllUsers,
    getUserById,
    blockUser,
    unblockUser,
    getAllJobs,
    deleteJob
};