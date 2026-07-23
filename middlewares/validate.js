export const validate = (schemas) => {
    return (req, res, next) => {

        const validationErrors = {};

        for (const [location, schema] of Object.entries(schemas)) {

            const result = schema.safeParse(req[location]);

            if (!result.success) {

                result.error.issues.forEach(issue => {
                    validationErrors[`${location}.${issue.path.join(".")}`] = issue.message;
                });

                continue;
            }

            if (location === "query") {
                Object.assign(req.query, result.data);
            } else {
                req[location] = result.data;
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationErrors
            });
        }

        next();
    };
};