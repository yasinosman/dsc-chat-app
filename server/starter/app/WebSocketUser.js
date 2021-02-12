module.exports = class WebSocketUser {
    constructor(socket, id, messageHandler, closeHandler) {
        this.socket = socket;
        this.id = id;

        this.socket.on("message", (msg) => {
            messageHandler(msg, this.id);
        });
        this.socket.on("close", () => {
            closeHandler(this.id);
        });
    }

    /**
     *  Kullanıcıya bir mesaj göndermeye çalışır.
     * Başarılı olursa mesajı döndürür, hata ile karşılaşırsa
     * bir hata döndürür
     * @param {String} message
     */
    send = (message) => {
        return new Promise((resolve, reject) => {
            try {
                this.socket.send(message);
                resolve(message);
            } catch (error) {
                reject(error);
            }
        });
    };
};
