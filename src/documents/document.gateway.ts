import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DocumentActions } from './document.actions';
import { randomUUID } from 'crypto';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface WSMessage<T = any> {
  roomId: string;
  data: T;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DocumentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(DocumentActions.JOIN)
  async join(socket: Socket, data: WSMessage) {
    socket.emit(DocumentActions.JOIN, { room: data.roomId });
    console.log(data);
    return data;
  }

  @SubscribeMessage(DocumentActions.TYPING)
  async typing(socket: Socket, data: WSMessage) {
    socket.to(data.roomId).emit(DocumentActions.TYPING, { room: data.roomId });
    return data;
  }

  @SubscribeMessage(DocumentActions.MOUSE_MOVING)
  async mouseMoving(socket: Socket, data: WSMessage) {
    socket.emit(DocumentActions.MOUSE_MOVING, { room: data.roomId });
  }

  @SubscribeMessage(DocumentActions.CHANGING_SETTINGS)
  async changingSettings(socket: Socket, data: WSMessage) {
    socket.emit(DocumentActions.CHANGING_SETTINGS, { room: data.roomId });
    return data;
  }

  broadcastRooms() {
    const { rooms } = this.server.sockets.adapter;
    const backRooms = Array.from(rooms.keys());

    this.server.emit(DocumentActions.SHARE_ROOMS, {
      rooms: backRooms,
    });
  }

  // Example
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
  // Example

  handleConnection(client: Socket, ...args: any[]) {
    this.broadcastRooms();
    console.log(`Connected ${client.id}`); 
  }

  handleDisconnect(client: Socket) {
    client.rooms.forEach((room) => {
      client.leave(room);
    });
    console.log(`Disconnected ${client.id}`); 
  }
}
