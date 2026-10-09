const pool = require("../config/db");

const createApplication = async (
    jobId,
    candidateId,
    resumeId,
    coverLetter
) => {
    const result = await pool.query(
        `INSERT INTO applications
        (
            job_id,
            candidate_id,
            cover_letter
        )
        VALUES ($1,$2,$3)
        RETURNING *`,
        [
            jobId,
            candidateId,
            resumeId,
            coverLetter
        ]
    );

    return result.rows[0];
};

const getApplicationsByCandidate = async (candidateId) => {
    const result = await pool.query(
         `SELECT
            a.*,
            j.title AS job_title,
            c.company_name,
            f.file_name AS resume_name,
            f.file_url AS resume_url
         FROM applications a
         JOIN jobs j
         ON a.job_id = j.id
         JOIN companies c
         ON j.company_id = c.id
         LEFT JOIN files f
         ON a.resume_id = f.id
         WHERE a.candidate_id = $1
         ORDER BY a.created_at DESC`,
        [candidateId]
    );

    return result.rows;
};



const getApplicationsByRecruiter = async (recruiterId) => {
    const result = await pool.query(
        `SELECT
            a.*,
            j.title AS job_title,
            u.name AS candidate_name,
            u.email AS candidate_email,
            f.file_name AS resume_name,
            f.file_url AS resume_url
         FROM applications a
         JOIN jobs j
         ON a.job_id = j.id
         JOIN users u
         ON a.candidate_id = u.id
         LEFT JOIN files f
         ON a.resume_id = f.id
         WHERE j.recruiter_id = $1
         ORDER BY a.created_at DESC`,
        [recruiterId]
    );

    return result.rows;
};

const updateApplicationStatus = async (
    applicationId,
    recruiterId,
    status
) => {
    const result = await pool.query(
        `UPDATE applications a
         SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
         FROM jobs j
         WHERE a.id = $2
         AND a.job_id = j.id
         AND j.recruiter_id = $3
         RETURNING a.*`,
        [
            status,
            applicationId,
            recruiterId
        ]
    );

    return result.rows[0];
};

module.exports = {
    createApplication,
    getApplicationsByCandidate,
    getApplicationsByRecruiter,
    updateApplicationStatus
};