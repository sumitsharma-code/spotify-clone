const {ImageKit} = require("@imagekit/nodejs");
require("dotenv").config();

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMGKIT_PRIVATE_KEY,
})

async function uploadFile(file) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "spotify-clone/music"
    })

    return result;
}

module.exports = { uploadFile };