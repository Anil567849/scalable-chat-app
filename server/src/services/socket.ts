import { config } from 'dotenv';
config();
import { Server } from "socket.io";
import Redis from "ioredis";

const redis_pub = new Redis({
    port: parseInt(process.env.REDIS_PORT as string) as number, // Redis port
    host: process.env.REDIS_HOST as string, // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.REDIS_PASSWORD as string,
});
const redis_sub = new Redis({
    port: parseInt(process.env.REDIS_PORT as string) as number, // Redis port
    host: process.env.REDIS_HOST as string, // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.REDIS_PASSWORD as string,
});


export default class SocketService {
    private _io: Server | null = null;

    constructor() {
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: ['http://localhost:3000']
            }
        })
        redis_sub.subscribe("redis:message");
    }

    public initListeners() {
        const io = this.io;
        io?.on("connection", (socket) => {
            console.log('user connected:', socket.id);

            // Listen for custom events
            socket.on("message", async (message: string) => {
                console.log("server:msg", message);
                try {
                    await redis_pub.publish("redis:message", message);
                } catch (error) {
                    console.log("Error", error);
                }
            });

            // Handle client disconnect
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        })

        redis_sub.on("message", async (channel, message) => {
            switch (channel) {
                case "redis:message":
                    console.log('redis:sub:message', message);
                    io?.emit("message", message);
                    break;
            }
        })
    }

    get io() {
        return this._io;
    }
}