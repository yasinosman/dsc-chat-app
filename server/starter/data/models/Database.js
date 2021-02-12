require("dotenv").config();
const mongoose = require("mongoose");

module.exports = class Database {
    static connect = () =>
        new Promise((resolve, reject) => {
            mongoose
                .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => resolve())
                .catch((err) => reject(err));
        });
};
