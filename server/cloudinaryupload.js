const cloudinary = require("./config/cloudinary");

const cloudinaryUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "fridgechef/recipes",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }


                resolve(result);
            }
        );

        stream.end(buffer);


    });
};

module.exports = cloudinaryUpload;
