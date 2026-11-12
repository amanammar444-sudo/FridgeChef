const express = require("express");
const upload = require("../middleware/upload");
const cloudinaryUpload = require("../cloudinaryupload");

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image",
            });
        }


        const result = await cloudinaryUpload(req.file.buffer);

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });


    } catch (error) {
        console.error("Cloudinary upload error:", error.message);


        return res.status(500).json({
            success: false,
            message: "Image upload failed",
        });


    }
});

module.exports = router;
