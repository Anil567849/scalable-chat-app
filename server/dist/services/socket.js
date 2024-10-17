"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const redis_pub = new ioredis_1.default({
    port: parseInt(process.env.REDIS_PORT), // Redis port
    host: process.env.REDIS_HOST, // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.REDIS_PASSWORD,
});
const redis_sub = new ioredis_1.default({
    port: parseInt(process.env.REDIS_PORT), // Redis port
    host: process.env.REDIS_HOST, // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.REDIS_PASSWORD,
});
class SocketService {
    constructor() {
        this._io = null;
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ["*"],
                origin: ['http://localhost:3000']
            }
        });
        redis_sub.subscribe("redis:message");
    }
    initListeners() {
        const io = this.io;
        io === null || io === void 0 ? void 0 : io.on("connection", (socket) => {
            console.log('user connected:', socket.id);
            // Listen for custom events
            socket.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                console.log("server:msg", message);
                try {
                    yield redis_pub.publish("redis:message", message);
                }
                catch (error) {
                    console.log("Error", error);
                }
            }));
            // Handle client disconnect
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
        redis_sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            switch (channel) {
                case "redis:message":
                    console.log('redis:sub:message', message);
                    io === null || io === void 0 ? void 0 : io.emit("message", message);
                    break;
            }
        }));
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
