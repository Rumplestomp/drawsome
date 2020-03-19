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

// App Setup ------------------------------

"use strict";

const express = require("express");
const app = express();
app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "uploads") });

const fs = require("fs");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const myurl = "mongodb://mongo:27017";

// Constants

const IMAGE_COLLECTION = "images";
const USER_COLLECTION = "users";

// Classes ------------------------------

class Image {
    constructor(file, encode_image) {
        this.contentType = file.mimetype;
        this.image = new Buffer(encode_image, "base64");
    }
}

// Routes ------------------------------

app.get("/", (req, res, next) => {
    res.end("Aight bud");
});

app.post("/api/image/", upload.single('image'), (req, res, next) => {
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

app.get("/api/image/:id/", (req, res, next) => {
    let id = req.params.id;

    let db = req.app.get("db");
    db.collection(IMAGE_COLLECTION).findOne({ "_id": ObjectId(id) }, (err, result) => {
        if (err) return res.status(500).end(err);
        res.contentType(result.contentType);
        res.send(result.image.buffer);
    });
});

// Starting Server ------------------------------

const http = require('http');
const PORT = 3000;

MongoClient.connect(myurl, (err, client) => {
    if (err) return console.log(err);
    app.set("db", client.db("drawesome"));
    http.createServer(app).listen(PORT, (err) => {
        if (err) return console.log(err);
        else console.log(`HTTP server on http://localhost:${PORT}`)
    });
});
