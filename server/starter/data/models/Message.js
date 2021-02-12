const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Message",
    new mongoose.Schema({
        from: String,
        at: Date,
        content: String,
    })
);
