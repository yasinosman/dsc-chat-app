import "./ChatHeader.css";

export default function ChatHeader(props) {
    const { names } = props;

    return (
        <div className="chat__header">
            <h1>DSC-Chat</h1>
            <p>
                {names.join(", ").length > 50
                    ? names.join(", ").substring(0, 50) + "..."
                    : names.join(", ")}
            </p>
        </div>
    );
}
