const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());

app.get("/", (req, res, next) => {
    res.send(["Aiight bud"]);
});


app.listen(process.env.PORT || 8081); // client is already running on 8080

