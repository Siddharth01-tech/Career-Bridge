const validateCreateCompany = (req, res, next) => {
    const { companyName, description, website, location, industry } = req.body;

    if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
        return res.status(400).json({
            message: "Company name is required"
        });
    }

    req.body.companyName = companyName.trim();
    if (description) req.body.description = description.trim();
    if (website) req.body.website = website.trim();
    if (location) req.body.location = location.trim();
    if (industry) req.body.industry = industry.trim();

    next();
};

const validateUpdateCompany = (req, res, next) => {
    const { companyName, description, website, location, industry } = req.body;

    const hasAnyField = [
        companyName,
        description,
        website,
        location,
        industry,
        req.file
    ].some(field => field !== undefined);

    if (!hasAnyField) {
        return res.status(400).json({
            message: "At least one field or logo is required to update company"
        });
    }

    if (companyName !== undefined) {
        if (typeof companyName !== "string" || !companyName.trim()) {
            return res.status(400).json({
                message: "Company name cannot be empty"
            });
        }
        req.body.companyName = companyName.trim();
    }

    if (description !== undefined) req.body.description = description ? description.trim() : null;
    if (website !== undefined) req.body.website = website ? website.trim() : null;
    if (location !== undefined) req.body.location = location ? location.trim() : null;
    if (industry !== undefined) req.body.industry = industry ? industry.trim() : null;

    next();
};

module.exports = {
    validateCreateCompany,
    validateUpdateCompany
};
