export default function ChatNotification(props) {
    const { isConnected, lastConnected, lastDisconnected } = props;

    let notification = null;
    if (isConnected) {
        notification = "Sunucuya baglanildi.";
    }
    if (lastConnected && !lastDisconnected) {
        notification = `${lastConnected.user.name} katıldı.`;
    }
    if (lastDisconnected && !lastConnected) {
        notification = `${lastDisconnected.user.name} ayrıldı.`;
    }
    if (lastConnected && lastDisconnected) {
        //En guncel olanı goster
        if (lastDisconnected.at.getTime() > lastConnected.at.getTime()) {
            notification = `${lastDisconnected.user.name} ayrıldı.`;
        } else {
            notification = `${lastConnected.user.name} katıldı.`;
        }
    }
    if (!isConnected) {
        notification = "Sunucuya baglaniliyor. Lutfen bekleyiniz";
    }
    return <div className="chat__notification">{notification ? notification : ""}</div>;
}
