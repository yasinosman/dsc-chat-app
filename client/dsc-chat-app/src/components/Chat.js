import React, { Component } from "react";
import faker from "faker";

import ChatMessages from "./ChatMessages";
import ChatNotification from "./ChatNotification";

import "./Chat.css";
import ChatHeader from "./ChatHeader";
import ChatForm from "./ChatForm";

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            users: [],
            messages: [],
            lastConnected: null,
            lastDisconnected: null,
            isConnected: false,
        };

        this.setupWebSocket = this.setupWebSocket.bind(this);
        this.messageHandler = this.messageHandler.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount = () => {
        this.socket = this.setupWebSocket();
    };

    setupWebSocket = () => {
        try {
            const socket = new WebSocket("ws://localhost:8080");
            socket.onerror = (error) => {
                console.log(error);
            };
            socket.onopen = () => {
                console.log(" > WebSocket sunucusuna baglanildi");
                this.setState((st) => ({ isConnected: true }));
            };
            socket.onclose = () => {
                console.error(" > WebSocket sunucu baglantisi koptu");
                this.setState((st) => ({ isConnected: false }));
                setTimeout(() => {
                    this.setupWebSocket();
                }, 5000);
            };
            socket.onmessage = (msg) => {
                try {
                    msg = JSON.parse(msg.data);
                    this.messageHandler(msg);
                } catch (error) {
                    console.log(error);
                }
            };

            return socket;
        } catch (error) {
            console.log(error);
        }
    };

    messageHandler = (msg) => {
        switch (msg.Header) {
            case "MessageReceived": {
                this.setState((st) => ({
                    messages: [...st.messages, msg.Payload.Message],
                }));
                break;
            }
            case "MessageSent": {
                this.setState((st) => ({
                    messages: [...st.messages, msg.Payload.Message],
                }));
                break;
            }
            case "UserConnected": {
                //Generate fake data
                const userPrefix = faker.name.prefix();
                const userName = faker.name.firstName();
                const userNickName = `${userPrefix} ${userName}`;
                const colors = [
                    "rgba(176,119,227,255)",
                    "rgba(50,79,236,255)",
                    "rgba(0,223,153,255)",
                ];
                const userColor = colors[Math.floor(Math.random() * colors.length)];

                this.setState((st) => ({
                    lastConnected: {
                        user: {
                            name: userNickName,
                        },
                        at: new Date(),
                    },
                    users: [
                        ...st.users,
                        { id: msg.Payload.User.Id, name: userNickName, color: userColor },
                    ],
                }));
                break;
            }
            case "UserDisconnected": {
                const user = this.state.users.find((user) => user.id === msg.Payload.User.Id);
                if (user) {
                    this.setState((st) => ({
                        lastDisconnected: {
                            user: {
                                name: user.name,
                            },
                            at: new Date(),
                        },
                        messages: st.messages.filter(
                            (msg) => msg.from !== user.id && msg.from !== user.name
                        ),
                        users: st.users.filter((u) => u.id !== user.id),
                    }));
                }
                break;
            }
            default: {
                console.log(msg);
            }
        }
    };

    sendMessage = (msg) => {
        return new Promise((resolve, reject) => {
            try {
                this.socket.send(msg);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    render = () => {
        const { isConnected, lastConnected, lastDisconnected, messages, users } = this.state;

        const names = users.map((u) => u.name);
        return (
            <div className="chat">
                <ChatHeader names={names} />
                <ChatMessages messages={messages} users={users} />
                <ChatNotification
                    isConnected={isConnected}
                    lastConnected={lastConnected}
                    lastDisconnected={lastDisconnected}
                />
                <ChatForm sendMessage={this.sendMessage} />
            </div>
        );
    };
}
