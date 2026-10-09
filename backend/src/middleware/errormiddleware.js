
const errorHandler = (err, req, res, next) => {
    console.error("Unhandled Error:", err);

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "File is too large. Please upload a smaller file."
        });
    }

    if (err.message && err.message.includes("Only pdf and doc") || err.message && err.message.includes("Only jpg and png")) {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.code === "23505") {
        return res.status(409).json({
            message: "A record with this information already exists."
        });
    }

    if (err.code === "23503") {
        return res.status(400).json({
            message: "Referenced entity does not exist."
        });
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }

    const status = err.statusCode || 500;
    const isProd = process.env.NODE_ENV === "production";

    res.status(status).json({
        message: err.message && !isProd ? err.message : "Internal server error"
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found.`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
