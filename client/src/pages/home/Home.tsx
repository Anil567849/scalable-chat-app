import { useEffect, useState } from 'react';
import classes from './css/home.module.css';
import { io, Socket } from 'socket.io-client'

function Home() {
    const [message, setMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const msgRec = (msg: string) => {
        setMessages((prev) => [...prev, msg]);
    }

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        setSocket(_socket)

        _socket.on("connect", () => {
            console.log(_socket.id);
        });
        _socket.on("message", msgRec);

        return () => {
            _socket.off("message", msgRec);
            _socket.disconnect();
            setSocket(undefined)
        }
    }, [])

    const handleSend = () => {
        if (!socket) return;
        if (message.trim() !== '') {
            socket.emit("message", message);
            setMessage('');
        }
    };

    return (
        <div className={classes["app-container"]}>
            <div className={classes["left-side"]}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSend}>Send</button>
            </div>

            <div className={classes["right-side"]}>
                <h3>Messages</h3>
                <div className="message-list">
                    {messages.map((msg, index) => (
                        <div key={index} className={classes["message-item"]}>
                            {msg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
