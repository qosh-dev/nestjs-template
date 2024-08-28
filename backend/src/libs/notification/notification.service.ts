import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IRequestContext, SystemHeaders } from '../als/app-context.common';
import { wait } from '../test/test.service';
import { NotificationGateway, WS_GATEWAY } from './notification.gateway';
import { EventSignalType } from './notification.registry';

@Injectable()
export class NotificationService {
  _gateway: NotificationGateway;
  private logger: Logger = new Logger(NotificationService.name);

  constructor(private als: AsyncLocalStorage<IRequestContext>) {}

  async onModuleInit() {
    await wait(1000)
    setTimeout(() => {
      this._gateway = Reflect.getMetadata(WS_GATEWAY, NotificationGateway);
    }, 1000);
  }

  activeConnections() {
    return this._gateway.activeEmployees;
  }

  sendSignalToCurrentConnection(type: EventSignalType,payload: any = {}) {
    const store = this.als.getStore();
    const employeeId = store[SystemHeaders.employeeId];
    if(!employeeId){
      this.logger.log('Employee not specified');
      return
    }
    return this.sendSignal(employeeId, type,payload);
  }

  sendSignal(employeeId: string, type: EventSignalType, payload: any,) {
    return this.send(employeeId, 'signal', { type, payload });
  }

  broadcastSignal(type: EventSignalType,payload: any = {}) {
    return this.broadcast('signal', { type , payload});
  }

  // --------------------------------------------------------------------------------

  sendToCurrentConnection(event: string, data: any) {
    const store = this.als.getStore();
    const employeeId = store[SystemHeaders.employeeId];
    return this.send(employeeId, event, data);
  }

  send(employeeId: string, event: string, data: any) {
    if (!this._gateway) {
      this.logger.log('Gateway not implemented');
      return;
    }
    this._gateway.activeEmployees.get(employeeId)?.emit(event, data);
    console.log({
      messageSend: {
        employeeId,
        event
      }
    })
  }

  sendMany(employeeIds: string[], event: string, data: any) {
    if (!this._gateway) {
      this.logger.log('Gateway not implemented');
      return;
    }
    if (!employeeIds.length) {
      return;
    }
    for (const employeeId of employeeIds) {
      this._gateway.activeEmployees.get(employeeId)?.emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    if (!this._gateway) {
      // this.logger.log('Gateway not implemented');
      return;
    }

    if (!this._gateway.activeEmployees.size) {
      return;
    }
    const employeeIds = this._gateway.activeEmployees.keys();
    for (const employeeId of employeeIds) {
      this._gateway.activeEmployees.get(employeeId)?.emit(event, data);
    }
  }
}
