const ws = require("ws");
const { v4: uuid } = require("uuid");
const WebSocketUser = require("./WebSocketUser");
const MessageController = require("../data/controllers/MessageController");

module.exports = class WebSocketServer {
    constructor(options) {
        //Http server ayarları
        this.options = options;

        //WebSocket sunucusuna bağlı olan kullanıcıların listesini tut
        this.users = [];

        //WebSocket sunucusunu başlat
        this.setupServer();
    }

    setupServer = () => {
        //Yeni bir WebSocket sunucusu yarat
        const wss = new ws.Server({ ...this.options });

        //Sunucu hatalarını yakala
        wss.on("error", (error) => console.log(error));

        //Yeni bir baglanti geldiginde bu baglantiyi yakala ve işle
        wss.on("connection", this.handleConnection);
    };

    /**
     *  WebSocket sunucusuna bir bağlantı geldiğinde bu fonksiyon
     * çalışır. `socket` parametresi, bağlantıyı sağlayan WebSocket
     * nesnesidir.
     * @param {WebSocket} socket
     */
    handleConnection = async (socket) => {
        try {
            //Yeni kullanıcı için bir kimlik oluştur
            /**
             *  Yakaladığın bağlantıyı ve oluşturduğun kimlik ile
             * yeni bir kullanıcı oluştur.
             * Bu kullanıcıya gelen mesajları `messageHandler` fonksiyonunu
             * kullanarak işle,
             * Bu kullanıcının bağlantısının kopması durumunda
             * `closeHandler` fonksiyonunu kullanarak o kullanıcıyı
             * mevcut kullanıcılar listesinden çıkar.
             */
            //Kullanıcıya online kullanıcıların bilgisini yolla
            //Diğer kullanıcılara, yeni bir kullanıcının baglandigina dair bilgi ver
        } catch (error) {
            console.log(error);
        }
    };

    /**
     *  Kullanıcılara gelen mesajları işle
     * @param {String} msg
     * @param {String} id
     */
    messageHandler = (msg, id) => {
        try {
            //Id bilgisini kullanarak kullanıcıyı bulmaya çalış

            if (user) {
                //Mesajı konsola yazdır
                //Eğer kullanıcı varsa, kullanıcının gönderdiği mesajı herkese gönder.
                //Mesajı veritabanına kaydet
                //Kullanıcıya mesaj gönderme işleminin başarılı olduğuna dair bir mesaj gönder
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     *  Bağlantısı sonlanan kullanıcıyı, mevcut kullanıcılar listesinden
     * temizle.
     * @param {String} id
     */
    closeHandler = (id) => {
        //Mevcut kullanıcılar listesini filtrele
        //Geriye kalan kullanıcılara, bir kullanıcının çıktığına dair bilgi ver
    };

    /**
     *  Kullanıcının mesajını, kullanıcı hariç herkese gönderir.
     * @param {Array<WebSocketUser>} users
     * @param {String} msg
     * @param {String} ownerId
     */
    broadcast = (users, msg, ownerId) => {
        return new Promise((resolve, reject) => {});
    };
};
