const pool = require("../config/db");

const createJob = async ({
    recruiterId,
    companyId,
    title,
    description,
    location,
    jobType,
    salaryMin,
    salaryMax,
    skills,
    experience,
    deadline
}) => {
    const result = await pool.query(
        `INSERT INTO jobs
        (
            recruiter_id,
            company_id,
            title,
            description,
            location,
            job_type,
            salary_min,
            salary_max,
            skills,
            experience,
            deadline
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
            recruiterId,
            companyId,
            title,
            description,
            location || null,
            jobType,
            salaryMin !== undefined ? salaryMin : null,
            salaryMax !== undefined ? salaryMax : null,
            skills && skills.length > 0 ? skills : null,
            experience !== undefined ? experience : null,
            deadline || null
        ]
    );

    return result.rows[0];
};

const getJobs = async (filters = {}) => {
    let query = `
        SELECT
            j.*,
            c.company_name,
            c.location AS company_location,
            c.industry,
            c.website AS company_website
        FROM jobs j
        LEFT JOIN companies c
        ON j.company_id = c.id
    `;
    const conditions = [];
    const values = [];

    if (filters.search) {
        values.push(`%${filters.search}%`);
        conditions.push(`(j.title ILIKE $${values.length} OR j.description ILIKE $${values.length})`);
    }

    if (filters.location) {
        values.push(`%${filters.location}%`);
        conditions.push(`j.location ILIKE $${values.length}`);
    }

    if (filters.jobType) {
        values.push(filters.jobType);
        conditions.push(`j.job_type = $${values.length}`);
    }

    if (filters.companyId) {
        values.push(filters.companyId);
        conditions.push(`j.company_id = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY j.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
};

const getJobById = async (jobId) => {
    const result = await pool.query(
        `SELECT
            j.*,
            c.company_name,
            c.location AS company_location,
            c.industry,
            c.website AS company_website
        FROM jobs j
        LEFT JOIN companies c
        ON j.company_id = c.id
        WHERE j.id = $1`,
        [jobId]
    );

    return result.rows[0];
};

const updateJob = async (jobId, recruiterId, data) => {
    const {
        title,
        description,
        location,
        jobType,
        salaryMin,
        salaryMax,
        skills,
        experience,
        deadline
    } = data;

    const updates = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
        updates.push(`title = $${idx++}`);
        values.push(title);
    }
    if (description !== undefined) {
        updates.push(`description = $${idx++}`);
        values.push(description);
    }
    if (location !== undefined) {
        updates.push(`location = $${idx++}`);
        values.push(location);
    }
    if (jobType !== undefined) {
        updates.push(`job_type = $${idx++}`);
        values.push(jobType);
    }
    if (salaryMin !== undefined) {
        updates.push(`salary_min = $${idx++}`);
        values.push(salaryMin !== "" ? salaryMin : null);
    }
    if (salaryMax !== undefined) {
        updates.push(`salary_max = $${idx++}`);
        values.push(salaryMax !== "" ? salaryMax : null);
    }
    if (skills !== undefined) {
        updates.push(`skills = $${idx++}`);
        values.push(skills && skills.length > 0 ? skills : null);
    }
    if (experience !== undefined) {
        updates.push(`experience = $${idx++}`);
        values.push(experience !== "" ? experience : null);
    }
    if (deadline !== undefined) {
        updates.push(`deadline = $${idx++}`);
        values.push(deadline !== "" ? deadline : null);
    }

    if (updates.length === 0) {
        return await getJobById(jobId);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(jobId);
    const jobIdIdx = idx++;
    values.push(recruiterId);
    const recruiterIdIdx = idx++;

    const query = `
        UPDATE jobs
        SET ${updates.join(", ")}
        WHERE id = $${jobIdIdx}
        AND recruiter_id = $${recruiterIdIdx}
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteJob = async (jobId, recruiterId) => {
    const result = await pool.query(
        `DELETE FROM jobs
        WHERE id = $1
        AND recruiter_id = $2
        RETURNING *`,
        [jobId, recruiterId]
    );

    return result.rows[0];
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};