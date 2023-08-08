import { Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { User } from 'src/auth/user.entity';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws.middleware';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dto/createChannel.dto';
import { JoinChannelDto } from './dto/joinChannel.dto';
import { sendMessageDto } from './dto/sendMessage.dto';
import { GetChannelsDto } from './dto/getChannels.dto';

@WebSocketGateway(8001, { cors: '*' })
@UseGuards(WsJwtGuard)
export class ChannelsGateway {
  @WebSocketServer()
  server;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    // Logger.log('after init');
  }

  @SubscribeMessage('createChannel')
  async handleCreateChannel(
    _client: Socket,
    body: CreateChannelDto,
  ): Promise<void> {
    const { channelName, channelDescription, userId } = body;

    const existedChannel = await this.channelRepository.findOne({
      where: { name: channelName },
    });
    if (existedChannel) {
      this.server.emit('error', 'Channel name already exist');
      throw new Error('Channel name already exist');
    }

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        const channel = new Channel();
        channel.name = channelName;
        channel.description = channelDescription;
        channel.messages = [];
        channel.users = [user];
        channel.creator = user;
        const result = await this.channelRepository.save(channel);
        this.server.emit('channelCreated', result);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  @SubscribeMessage('getChannels')
  async getChannels(@MessageBody() body: GetChannelsDto): Promise<Channel[]> {
    const { searchQuery } = body;

    if (!searchQuery || searchQuery.trim() === '') {
      return this.channelRepository.find({ relations: ['users'] });
    }

    const filteredChannels = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .where('channel.name LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      })
      .getMany();

    return filteredChannels;
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(@MessageBody() body: JoinChannelDto) {
    const { userId, channelId } = body;

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        const channel = await this.channelRepository.findOne({
          where: { id: channelId },
          relations: ['users'],
        });
        if (channel) {
          const findUser = channel.users.find((user) => {
            user.id === userId;
          });
          if (!findUser) {
            channel.users.push(user);
            await this.channelRepository.save(channel);
            this.server.to(channel.name).emit('member', user);
          }
        } else {
          throw new Error('Channel not found');
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async joinWelcomeChannel(user: User) {
    const welcomeChannel = await this.channelRepository.findOne({
      where: { name: 'Welcome' },
      relations: ['users'],
    });
    if (welcomeChannel) {
      const findUser = welcomeChannel.users.find((u) => u.id === user.id);
      if (!findUser) {
        welcomeChannel.users.push(user);
        await this.channelRepository.save(welcomeChannel);
        this.server.to('Welcome').emit('member', user);
      }
    } else {
      throw new Error('Welcome channel not found');
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
  }

  @SubscribeMessage('sendMessage')
  async handleMessageTestback(
    _client: Socket,
    body: sendMessageDto,
  ): Promise<void> {
    const { room, content, userId, channelId } = body;

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        const channel = await this.channelRepository.findOne({
          where: { name: channelId },
          relations: ['users'],
        });
        if (channel) {
          const message = new Message();
          message.content = content;
          message.channel = channel;
          message.user = user;
          await this.messageRepository.save(message);
          this.server.to(room).emit('message', message);
        } else {
          throw new Error('Channel not found');
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  @SubscribeMessage('getChannelMessages')
  async getChannelMessages(
    @MessageBody() channelId: string,
  ): Promise<Message[]> {
    const channel = await this.channelRepository.findOne({
      where: { name: channelId },
      relations: ['messages', 'messages.channel', 'messages.user'],
    });
    return channel.messages;
  }

  @SubscribeMessage('getChannelMembers')
  async getChannelMembers(@MessageBody() channelId: string): Promise<User[]> {
    const channel = await this.channelRepository.findOne({
      where: { name: channelId },
      relations: ['users'],
    });
    return channel.users;
  }
}
