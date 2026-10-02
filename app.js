const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Jenkins CI/CD Pipeline!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});

module.exports = app;