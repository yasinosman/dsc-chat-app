const Database = require("./src/data/models/Database");
const WebSocketServer = require("./src/app/WebSocketServer");

class Server {
    constructor() {
        //Connect to database
        this.initDatabase();

        //Initialize websocket server
        this.initWebSocketServer();
    }

    initDatabase = () => {
        Database.connect()
            .then(() => console.log(" > Veritabanina baglanildi."))
            .catch((error) => console.log(error));
    };

    initWebSocketServer = () => {
        new WebSocketServer();
    };
}

new Server();
