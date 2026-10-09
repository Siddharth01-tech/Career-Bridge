const multer = require("multer");

const storage = multer.memoryStorage();

const resumeFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf","application/msword",];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only pdf and doc files are allow"));
    }
};

const logoFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg","image/png",];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only jpg and png images are allow"));
    }
};

const uploadResume = multer({
    storage,
    fileFilter: resumeFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadLogo = multer({
    storage,
    fileFilter: logoFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

module.exports = {
    uploadResume,
    uploadLogo
};