const pool = require("../config/db");

const createCompany = async (
    recruiterId,
    companyName,
    description,
    website,
    location,
    industry,
    logoId
) => {
    const result = await pool.query(
        `INSERT INTO companies
        (
            recruiter_id,
            company_name,
            description,
            website,
            location,
            industry,
            logo_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [
            recruiterId,
            companyName,
            description,
            website,
            location,
            industry,
            logoId
        ]
    );

    return result.rows[0];
};

const getCompanyByRecruiter = async (recruiterId) => {
    const result = await pool.query(
        `SELECT
            c.*,
            f.file_name AS logo_name,
            f.file_type AS logo_type,
            f.file_size AS logo_size,
            f.file_url AS logo_url,
            f.storage_public_id AS logo_file_id
         FROM companies c
         LEFT JOIN files f
         ON c.logo_id = f.id
         WHERE c.recruiter_id = $1`,
        [recruiterId]
    );

    return result.rows[0];
};

const updateCompany = async (
    recruiterId,
    companyName,
    description,
    website,
    location,
    industry,
    logoId
) => {
    const result = await pool.query(
        `UPDATE companies
         SET
            company_name = $1,
            description = $2,
            website = $3,
            location = $4,
            industry = $5,
            logo_id = COALESCE($6,logo_id),
            updated_at = CURRENT_TIMESTAMP
         WHERE recruiter_id = $7
         RETURNING *`,
        [
            companyName,
            description,
            website,
            location,
            industry,
            logoId,
            recruiterId
        ]
    );

    return result.rows[0];
};

module.exports = {
    createCompany,
    getCompanyByRecruiter,
    updateCompany
};