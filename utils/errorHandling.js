const { LIMIT_FILE_SIZE } = require("./constants");

const handleMulterError = (upload) => (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: `File too large. Max ${LIMIT_FILE_SIZE}MB allowed.` });
            }
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};
exports.handleMulterError = handleMulterError;