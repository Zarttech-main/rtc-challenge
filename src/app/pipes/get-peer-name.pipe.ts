import { Pipe, PipeTransform } from '@angular/core';
import { SocketService } from '../services/socket-service.service';

@Pipe({
  name: 'getPeerName'
})
export class GetPeerNamePipe implements PipeTransform {

  constructor(private socketService: SocketService) {}

  transform(value: string, ...args: unknown[]): string {
    return this.socketService.getPeerName(value);
  }

}
