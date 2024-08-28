import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { WebsocketGuard } from 'src/modules/auth/guards/websocket.guard';
import { EmployeeEntity } from 'src/modules/employee/entities/employee.entity';
import { EntityManager } from 'typeorm';
import { NotificationService } from './notification.service';


export const WS_GATEWAY = 'WS_GATEWAY'
@Injectable()
@WebSocketGateway({
  namespace: '/api/events',
  origin: [
    'http://ec2-16-170-228-184.eu-north-1.compute.amazonaws.com',
    'http://109.75.138.33:5173',
    'http://localhost:5173',
    'http://localhost',
  ],
  methods: ['GET', 'POST'],
})
@UseGuards(WebsocketGuard)
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  activeEmployees: Map<string, Socket> = new Map();

  constructor(
    private service: NotificationService,
    private readonly orm: EntityManager,
  ) {}

  onModuleInit() {
    Reflect.defineMetadata(WS_GATEWAY, this, NotificationGateway);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new UnauthorizedException();
      }
      const res = jwt.verify(token, process.env.JWT_SECRET);
      const employeeId = res['data']['id'] as string;
      const employeeExist = await this.orm.existsBy(EmployeeEntity, {
        id: employeeId,
      });
      if (!employeeExist) {
        return;
      }
      this.activeEmployees.set(employeeId, client);
    } catch {
      return;
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      return;
    }
    try {
      const res = jwt.verify(token, process.env.JWT_SECRET);
      const employeeId = res['data']['id'] as string;
      const employeeExist = await this.orm.existsBy(EmployeeEntity, {
        id: employeeId,
      });
      if (!employeeExist) {
        return;
      }
      this.activeEmployees.delete(employeeId);
    } catch {}
  }
}
