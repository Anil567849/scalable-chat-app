"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
function main() {
    var _a;
    const server = http_1.default.createServer();
    const socketService = new socket_1.default();
    (_a = socketService.io) === null || _a === void 0 ? void 0 : _a.attach(server);
    server.listen(process.env.PORT, () => console.log("listening on port:", process.env.PORT));
    socketService.initListeners();
}
main();
