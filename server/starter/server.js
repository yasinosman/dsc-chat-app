const Database = require("./src/data/models/Database");
const WebSocketServer = require("./src/app/WebSocketServer");
const express = require("express");
const http = require("http");

class Server {
    constructor() {
        //Connect to database
        this.initDatabase();

        //Initialize server
        this.initServer();
    }

    initDatabase = () => {
        Database.connect()
            .then(() => console.log(" > Veritabanina baglanildi."))
            .catch((error) => console.log(error));
    };

    initServer = () => {
        const PORT = process.env.PORT || 3000;

        const app = express();
        const server = http.createServer(app);
        server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

        new WebSocketServer({ server });
    };
}

new Server();
