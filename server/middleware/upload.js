const multer = require("multer");

const storage = multer.memoryStorage();

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            return cb(null, true);
        }


        cb(new Error("Only JPEG, PNG, and WebP images are allowed"));

    },
});

module.exports = upload;
