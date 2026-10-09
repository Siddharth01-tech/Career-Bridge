const validateAdminIdParam = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            message: "Invalid ID parameter. ID must be a positive integer."
        });
    }

    req.params.id = parseInt(id, 10);
    next();
};

module.exports = {
    validateAdminIdParam
};
