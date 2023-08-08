import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Channel, Message, User]),
    // AuthModule,
  ],
  controllers: [],
  providers: [ChannelsService, ChannelsGateway],
  exports: [ChannelsGateway],
})
export class ChannelsModule {}
