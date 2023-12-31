import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { User } from './user.entity';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './multer.middleware';
import { ChannelsModule } from 'src/channel/channels.module';
@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		MulterModule.register(multerOptions),
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: process.env.AUTH_SECRET,
				signOptions: {
					expiresIn: '1d',
				},
			}),
		}),
		ChannelsModule,
	],
	providers: [LocalStrategy, AuthService, JwtStrategy],
	controllers: [AuthController, UsersController],
	// exports: [User],
})
export class AuthModule {}
