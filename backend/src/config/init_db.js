const pool = require("./db");

const initDatabase = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'candidate',
                is_blocked BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                file_name VARCHAR(255) NOT NULL,
                file_type VARCHAR(100),
                file_size INTEGER,
                file_url TEXT NOT NULL,
                storage_public_id VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS candidate_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                phone VARCHAR(50),
                skills TEXT[],
                education TEXT,
                experience TEXT,
                location VARCHAR(255),
                bio TEXT,
                resume_id INTEGER REFERENCES files(id) ON DELETE SET NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                recruiter_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                company_name VARCHAR(255) NOT NULL,
                description TEXT,
                website VARCHAR(255),
                location VARCHAR(255),
                industry VARCHAR(255),
                logo_id INTEGER REFERENCES files(id) ON DELETE SET NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                recruiter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(255),
                job_type VARCHAR(100) NOT NULL,
                salary_min NUMERIC,
                salary_max NUMERIC,
                skills TEXT[],
                experience INTEGER,
                deadline DATE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
                candidate_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                resume_id INTEGER REFERENCES files(id) ON DELETE SET NULL,
                cover_letter TEXT,
                status VARCHAR(50) DEFAULT 'applied',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await pool.query(query);
        console.log("Database tables verified/created successfully.");

        // Ensure default Super Admin account exists
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@careerbridge.com").toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
        const adminName = process.env.ADMIN_NAME || "Platform Admin";

        const existingAdmin = await pool.query(
            "SELECT id, role FROM users WHERE email = $1",
            [adminEmail]
        );

        if (existingAdmin.rows.length === 0) {
            const bcrypt = require("bcryptjs");
            const hash = await bcrypt.hash(adminPassword, 10);
            await pool.query(
                `INSERT INTO users (name, email, password_hash, role)
                 VALUES ($1, $2, $3, 'admin')`,
                [adminName, adminEmail, hash]
            );
            console.log(`Default admin user initialized successfully (${adminEmail})`);
        } else if (existingAdmin.rows[0].role !== "admin") {
            await pool.query(
                "UPDATE users SET role = 'admin' WHERE id = $1",
                [existingAdmin.rows[0].id]
            );
            console.log(`User ${adminEmail} role updated to admin`);
        }
    } catch (error) {
        console.error("Database schema initialization error:", error);
    }
};

module.exports = initDatabase;

if (require.main === module) {
    require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
    initDatabase().then(() => {
        pool.end();
    });
}
