import "./ChatMessages.css";

export default function ChatMessages(props) {
    const { messages, users } = props;
    return (
        <div className="chat__messages">
            {messages.map((message) => {
                let displayName, displayColor;
                const user = users.find((u) => u.id === message.from);
                if (user) {
                    displayName = user.name;
                    displayColor = user.color;
                } else {
                    displayName = "Siz";
                    displayColor = "black";
                }

                const messageDate = new Date(message.at);

                const displayDate = `${("0" + messageDate.getHours()).slice(-2)}:${(
                    "0" + messageDate.getMinutes()
                ).slice(-2)}`;

                const classes = `chat__message ${
                    user ? "chat__message--received" : "chat__message--sent"
                }`;

                return (
                    <div className={classes} key={message.at}>
                        <div className="chat__message__from" style={{ color: displayColor }}>
                            {displayName}
                        </div>
                        <div className="chat__message__content">{message.content}</div>
                        <div className="chat__message__at">{displayDate}</div>
                    </div>
                );
            })}
        </div>
    );
}
