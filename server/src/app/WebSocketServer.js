const ws = require("ws");
const { v4: uuid } = require("uuid");
const WebSocketUser = require("./WebSocketUser");
const MessageController = require("../data/controllers/MessageController");

module.exports = class WebSocketServer {
    constructor() {
        //WebSocket sunucusuna bağlı olan kullanıcıların listesini tut
        this.users = [];

        //WebSocket sunucusunu başlat
        this.setupServer();
    }

    setupServer = () => {
        //Yeni bir WebSocket sunucusu yarat
        const wss = new ws.Server({ port: process.env.WSS_PORT });

        //Sunucu hatalarını yakala
        wss.on("error", (error) => console.log(error));

        //Yeni bir baglanti geldiginde bu baglantiyi yakala ve işle
        wss.on("connection", this.handleConnection);

        //Sunucunun başladığına dair bilgi ver
        console.log(
            ` > WebSocket sunucusu ws://localhost:${process.env.WSS_PORT} adresinde calisiyor.`
        );
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
            const userID = uuid();
            console.log(
                ` > WebSocket sunucusuna yeni bir kullanici baglandi. Kullanıcı kimligi: ${userID}`
            );

            /**
             *  Yakaladığın bağlantıyı ve oluşturduğun kimlik ile
             * yeni bir kullanıcı oluştur.
             * Bu kullanıcıya gelen mesajları `messageHandler` fonksiyonunu
             * kullanarak işle,
             * Bu kullanıcının bağlantısının kopması durumunda
             * `closeHandler` fonksiyonunu kullanarak o kullanıcıyı
             * mevcut kullanıcılar listesinden çıkar.
             */
            const newUser = new WebSocketUser(
                socket,
                userID,
                this.messageHandler,
                this.closeHandler
            );
            this.users.push(newUser);

            //Kullanıcıya online kullanıcıların bilgisini yolla
            this.users &&
                this.users.forEach((user) => {
                    if (user.id !== userID) {
                        newUser.send(
                            JSON.stringify({
                                Header: "UserConnected",
                                Payload: {
                                    User: {
                                        Id: user.id,
                                    },
                                },
                            })
                        );
                    }
                });

            //Diğer kullanıcılara, yeni bir kullanıcının baglandigina dair bilgi ver
            this.broadcast(
                this.users,
                JSON.stringify({
                    Header: "UserConnected",
                    Payload: {
                        User: {
                            Id: userID,
                        },
                    },
                }),
                userID
            );
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
            const user = this.users.find((u) => u.id === id);

            if (user) {
                //Mesajı konsola yazdır
                console.log(
                    ` > Bir kullanici WebSocket sunucusuna mesaj gonderdi: "${msg}" (Kullanici kimligi: ${user.id}).`
                );

                //Eğer kullanıcı varsa, kullanıcının gönderdiği mesajı herkese gönder.
                const messageDate = new Date();

                this.broadcast(
                    this.users,
                    JSON.stringify({
                        Header: "MessageReceived",
                        Payload: {
                            Message: {
                                content: msg,
                                from: user.id,
                                at: messageDate,
                            },
                        },
                    }),
                    user.id
                );

                //Mesajı veritabanına kaydet
                MessageController.createMessage(user.id, messageDate, msg).then((doc) =>
                    console.log(
                        ` > Veritabanina yeni bir mesaj kaydedildi. (Mesaj kimligi: ${doc._id}).`
                    )
                );

                //Kullanıcıya mesaj gönderme işleminin başarılı olduğuna dair bir mesaj gönder
                user.send(
                    JSON.stringify({
                        Header: "MessageSent",
                        Payload: {
                            Message: {
                                content: msg,
                                at: new Date(),
                            },
                        },
                    })
                );
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
        console.log(`${id} kimlikli kullanıcının baglantisi sonlandi`);
        this.users = this.users.filter((u) => u.id !== id);

        //Geriye kalan kullanıcılara, bir kullanıcının çıktığına dair bilgi ver
        this.broadcast(
            this.users,
            JSON.stringify({
                Header: "UserDisconnected",
                Payload: {
                    User: {
                        Id: id,
                    },
                },
            })
        );
    };

    /**
     *  Kullanıcının mesajını, kullanıcı hariç herkese gönderir.
     * @param {Array<WebSocketUser>} users
     * @param {String} msg
     * @param {String} ownerId
     */
    broadcast = (users, msg, ownerId) => {
        return new Promise((resolve, reject) => {
            try {
                if (users && users.length > 0) {
                    users.forEach((user) => {
                        if (user.id !== ownerId) {
                            user.send(msg);
                        }
                    });
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
};
