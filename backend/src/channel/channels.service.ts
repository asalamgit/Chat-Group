import { Injectable, Logger } from '@nestjs/common';
import { ChannelsGateway } from './channels.gateway';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  // constructor(private channelGateway: ChannelsGateway) {}
}
