import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: process.env.WEBSITE_DOMAIN,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private readonly clients = {};

  @WebSocketServer() io: Namespace;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(clientToConnect: any) {
    const sockets = this.io.sockets;

    this.logger.log(`Client id: ${clientToConnect.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);

    const email = clientToConnect.handshake.query.email;

    if (this.clients[email]) {
      this.logger.log('Client with this email is already connected');
      return clientToConnect.disconnect(true);
    }

    this.clients[email] = clientToConnect.id;
  }

  handleDisconnect(clientToDisconnect: any) {
    this.logger.log(`Client id: ${clientToDisconnect.id} disconnected`);

    for (const email in this.clients) {
      if (this.clients[email] === clientToDisconnect.id) {
        delete this.clients[email];
        break;
      }
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    const toEmail = data.to;

    if (!this.clients[toEmail]) {
      this.logger.error('Missing recipient email');
      client.emit('chat-error', 'Missing recipient email');
      return;
    }

    const toId = this.clients[toEmail];

    if (toId === client.id) {
      this.logger.error('Invalid message');
      client.emit('chat-error', 'You cannot send message to yourself');
      return;
    }

    client.emit('message-success', data);

    this.io.to(toId).emit('message', {
      from: data.from,
      message: data.message,
      date: data.date,
    });
  }
}
