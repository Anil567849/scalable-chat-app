import { config } from 'dotenv';
config();
import http from 'http';
import SocketService from './services/socket';

function main() {

    const server = http.createServer();
    const socketService = new SocketService();
    socketService.io?.attach(server);

    server.listen(process.env.PORT, () => console.log("listening on port:", process.env.PORT))

    socketService.initListeners();

}

main();