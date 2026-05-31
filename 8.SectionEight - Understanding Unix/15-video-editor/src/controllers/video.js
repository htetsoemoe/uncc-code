const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/util");
const DB = require("../DB");
const FF = require("../../lib/FF"); // ffmpeg utilities functions

const getVideos = (req, res, handleErr) => {
    DB.update();
    const videos = DB.videos.filter((video) => {
        return video.userId === req.userId;
    });
    // console.log(videos);

    res.status(200).json(videos);
}

// Upload a video file route: a generated folder with unique ID which has a uploaded video with generated video name is original.mp4, thumbnail.jpg
const uploadVideo = async (req, res, handleErr) => {
    const specifiedFileName = req.headers.filename;
    const extension = path.extname(specifiedFileName).substring(1).toLowerCase();
    const name = path.parse(specifiedFileName).name;
    const videoId = crypto.randomBytes(4).toString("hex");

    // Validate uploaded file formats
    const FORMATS_SUPPORTED = ["mov", "mp4"];

    if (FORMATS_SUPPORTED.indexOf(extension) == -1) {
        return handleErr({
            status: 400,
            message: "Only these formats are allowed: mov, mp4",
        });
    }

    try {
        await fs.mkdir(`./storage/${videoId}`);
        const fullPath = `./storage/${videoId}/original.${extension}`; // the original video path
        const file = await fs.open(fullPath, "w");
        const fileStream = file.createWriteStream();

        // Thumbnail Path
        const thumbnailPath = `./storage/${videoId}/thumbnail.jpg`

        // piping from readable stream to writable stream
        await pipeline(req, fileStream);

        // ffmpeg
        // Make a thumbnail for the video file
        await FF.makeThumbnail(fullPath, thumbnailPath);

        // Get the dimensions
        const dimemsions = await FF.getDimensions(fullPath);

        DB.update();
        DB.videos.unshift({
            id: DB.videos.length,
            videoId,
            name,
            extension,
            dimemsions, // add thumbnail dimensions
            userId: req.userId,
            extractedAudio: false,
            resizes: {},
        });
        DB.save();

        res.status(201).json({
            status: "success",
            message: "The file was uploaded successfully!",
        });
    } catch (e) {
        // Delete the folder
        util.deleteFolder(`./storage/${videoId}`);
        if (e.code !== "ECONNRESET") return handleErr(e);
    }
}

const controller = {
    getVideos,
    uploadVideo,
}

module.exports = controller