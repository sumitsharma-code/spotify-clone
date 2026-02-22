const musicModel = require("../model/music.model");
const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {
    
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json( {message: "Unautherized"} )
    } 
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if(decoded.role !== "artist") {
            return res.status(403).json( {message: "You don't have access to create Music."} );
        }
        const {title} = req.body;
        const file = req.file;
        
        const result = await uploadFile(file.buffer.toString("base64"));
    
        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id,
        })
    
        res.status(201).json({
            message: "Music Created Successfully.",
            music: {
                id: music.id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(401).json( {message: "Unautherized"} )
    }
}

module.exports = { createMusic }