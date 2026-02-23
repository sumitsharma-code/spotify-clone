const express = require("express");
const musicController = require("../controller/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),   // ✅ lowercase
});

const router = express.Router();

router.post("/upload",authMiddleware.authArtist, upload.single("music"), musicController.createMusic);

router.post("/album", musicController.createAlbum);

router.get("/",authMiddleware.authUser, musicController.getAllMusics);

router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);
module.exports = router;