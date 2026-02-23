const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authArtist(req, res, next) {
    
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Unautherized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "artist") {
            return res.status(403).json({
                message: "Unautherized"
            })
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json()
    }
}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Unautherized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({
                message: "Unautherized"
            })
        }

        res.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            message: "Unautherized"
        })
    }

}

module.exports = { authArtist, authUser };