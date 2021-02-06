import React, { Component } from "react";

import "./ChatForm.css";

export default class ChatForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyDown);
    };

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.state.message && this.handleSubmit(this.state.message);
        }
    };

    handleChange = (e) => {
        this.setState((st) => ({ [e.target.name]: e.target.value }));
    };

    handleSubmit = (msg) => {
        this.props.sendMessage(msg).then(() => {
            this.setState((st) => ({ message: "" }));
        });
    };

    render = () => {
        return (
            <div className="chat__form">
                <input
                    type="text"
                    name="message"
                    id="chat-input"
                    className="chat__form__input"
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Bir mesaj yazın"
                />
            </div>
        );
    };
}
