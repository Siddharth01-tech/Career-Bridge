const { ImageKit } = require('@imagekit/nodejs');

const ImagekitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

async function uploadFile(file, folder = "job_portal_backend/") {
    const fileData = file.buffer.toString('base64');
    const originalName = file.originalname || `file_${Date.now()}`;
    const result = await ImagekitClient.files.upload({
        file: fileData,
        fileName: `${Date.now()}_${originalName}`,
        folder: folder
    });

    return result;
}

module.exports = {
    uploadFile
};