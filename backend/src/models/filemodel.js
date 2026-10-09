const pool = require("../config/db");

const createFile = async (
    userId,
    fileName,
    fileType,
    fileSize,
    fileUrl,
    storagePublicId
) => {
    const result = await pool.query(
        `INSERT INTO files
        (
            user_id,
            file_name,
            file_type,
            file_size,
            file_url,
            storage_public_id
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [
            userId,
            fileName,
            fileType,
            fileSize,
            fileUrl,
            storagePublicId
        ]
    );

    return result.rows[0];
};

const getFileById = async (fileId) => {
    const result = await pool.query(
        `SELECT *
         FROM files
         WHERE id = $1`,
        [fileId]
    );

    return result.rows[0];
};

module.exports = {
    createFile,
    getFileById
};