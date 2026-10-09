const pool = require("../config/db");

const createUser = async (name, email, passwordHash, role) => {
    const result = await pool.query(
        `INSERT INTO users
        (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at`,
        [name, email, passwordHash, role]
    );

    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT *
         FROM users
         WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};

const findUserById = async (id) => {
    const result = await pool.query(
        `SELECT id, name, email, role, is_blocked, created_at
         FROM users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};