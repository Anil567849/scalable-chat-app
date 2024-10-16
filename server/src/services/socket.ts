import { Server } from "socket.io";


export default class SocketService {
    private _io: Server | null;

    constructor(){
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: ['http://localhost:3000']
            }
        })
    }

    public initListeners(){
        const io = this.io;
        io?.on("connection", (socket) => {
            console.log('user connected:', socket.id);
            
            // Listen for custom events
            socket.on("message", async (message: string) => {
                console.log("server:msg", message);
                socket.emit('message', message)
            });
        
            // Handle client disconnect
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });  
        })
    }

    get io(){
        return this._io;
    }
}