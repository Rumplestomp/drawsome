// Sources

// Course Work
// lab5 - Storing Data
// hw3 - Building the backend
// lab6 - User Authentication
// hw3 - Managing users and Security
// lab7 - Web Security

// MongoDB
// https://www.npmjs.com/package/mongodb

// Image upload with Multer and MongoDB
// https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088

// App Setup ------------------------------------------------------------

const express = require("express");
const app = express();

const http = require('http');

const bodyParser = require("body-parser");

const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "uploads") });

const fs = require("fs");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const crypto = require("crypto");
const cookie = require("cookie");
const session = require("express-session");

const ev = require("express-validator");

// Constants ------------------------------------------------------------

const PORT = 3000;
const MONGO_URL = "mongodb://mongo:27017";
const IMAGE_COLLECTION = "images";
const USER_COLLECTION = "users";
const COOKIE_OPTIONS = {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
    httpOnly: false,
    secure: true,
    sameSite: true
};

// Middleware ------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true
    }
}));

app.use((req, res, next) => {
    let username = (req.session.username) ? req.session.username : "";
    res.setHeader("Set-Cookie", cookie.serialize("username", username, COOKIE_OPTIONS));
    next();
});

app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

// Helpers ------------------------------------------------------------

function isAuthenticated(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
}

function generateSalt() {
    return crypto.randomBytes(16).toString("base64");
}

function generateSaltedHash(password, salt) {
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    return hash.digest("base64");
}

// Classes ------------------------------------------------------------

class Image {
    constructor(file, encode_image) {
        this.contentType = file.mimetype;
        this.image = new Buffer(encode_image, "base64");
    }
}

class User {
    constructor(username, salt, saltedHash) {
        this._id = username;
        this.salt = salt;
        this.saltedHash = saltedHash;
    }
}

// Routes ------------------------------------------------------------

app.get("/", (req, res, next) => {
    res.send("Aight bud");
});

app.post("/api/image/", [
    isAuthenticated,
    upload.single('image')
], (req, res, next) => {
    if (!req.file) return res.status(400).end("missing file");

    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString("base64");
    let image = new Image(req.file, encode_image);

    let db = req.app.get("db");
    db.collection(IMAGE_COLLECTION).insertOne(image, (err, result) => {
        if (err) return res.status(500).end(err);

        res.send(result.insertedId);
    });
});

app.get("/api/image/:id/", [
    isAuthenticated
], (req, res, next) => {
    let id = req.params.id;

    let db = req.app.get("db");
    db.collection(IMAGE_COLLECTION).findOne({ "_id": ObjectId(id) }, (err, result) => {
        if (err) return res.status(500).end(err);

        res.contentType(result.contentType);
        res.send(result.image.buffer);
    });
});

app.post("/signup/", [
    ev.body("username").notEmpty().escape(),
    ev.body("password").notEmpty()
], (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    let db = req.app.get("db");
    db.collection(USER_COLLECTION).findOne({ _id: username }, (err, result) => {
        if (err) return res.status(500).end(err);
        if (result) return res.status(409).end(`username ${username} already exists`);

        let salt = generateSalt();
        let saltedHash = generateSaltedHash(password, salt);

        let user = new User(username, salt, saltedHash);
        db.collection(USER_COLLECTION).insertOne(user, (err, result) => {
            if (err) return res.status(500).end(err);

            res.setHeader("Set-Cookie", cookie.serialize("username", username, COOKIE_OPTIONS));
            req.session.username = username;
            return res.send(`user ${username} signed up`);
        });
    });
});

app.post("/signin/", [
    ev.body("username").notEmpty().escape(),
    ev.body("password").notEmpty()
], (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    let db = req.app.get("db");
    db.collection(USER_COLLECTION).findOne({ _id: username }, (err, result) => {
        if (err) return res.status(500).end(err);
        if (!result) return res.status(401).end("access denied");

        let salt = result.salt;
        let saltedHash = generateSaltedHash(password, salt);
        if (saltedHash !== result.saltedHash) return res.status(401).end("access denied");

        res.setHeader("set-Cookie", cookie.serialize("username", username, COOKIE_OPTIONS));
        req.session.username = username;
        return res.send(`user ${username} signed in`);
    });
});

app.get("/signout/", (req, res, next) => {
    req.session.destroy();
    res.setHeader("Set-Cookie", cookie.serialize("username", "", COOKIE_OPTIONS));
    res.redirect("/");
});

// Starting Server ------------------------------------------------------------

MongoClient.connect(MONGO_URL, (err, client) => {
    if (err) return console.log(err);

    app.set("db", client.db("drawesome"));

    http.createServer(app).listen(PORT, (err) => {
        if (err) return console.log(err);
        else console.log(`HTTP server on http://localhost:${PORT}`);
    });
});
