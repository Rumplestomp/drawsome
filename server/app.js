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

const express = require('express');
const app = express();
app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const MongoClient = require('mongodb').MongoClient;
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
    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString("base64");
    let image = new Image(req.file, encode_image);

    db.collection(IMAGE_COLLECTION).insertOne(image, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).end(err);
        } else {
            console.log(result);
            res.redirect("/");
        }
    });
});

app.get("/api/image/:id/", (req, res, next) => {
    let id = req.params.id;

    db.collection(IMAGE_COLLECTION).findOne({ "_id": ObjectId(id) }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).end(err);
        } else {
            console.log(result);
            res.contentType(result.contentType);
            res.send(result.image.buffer);
        }
    });
});

// Starting Server ------------------------------

const http = require('http');
const PORT = 3000;

MongoClient.connect(myurl, (err, client) => {
    if (err) console.log(err);
    db = client.db("drawesome");
    http.createServer(app).listen(PORT, (err) => {
        if (err) console.log(err);
        else console.log(`HTTP server on http://localhost:${PORT}`)
    });
});
