import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';
import { Response } from 'express';
import { ChannelsGateway } from 'src/channel/channels.gateway';

@Controller('users')
export class UsersController {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly channelsGateway: ChannelsGateway
	) {}

	@Post()
	async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
		try {
			const user = new User();

			const existingUser = await this.userRepository.findOne({
				where: [{ email: createUserDto.email }],
			});

			if (existingUser) {
				throw new BadRequestException('Email is already taken');
			}

			user.photo = 'uploads/1686682511490-29ba51e0-ae6c-4fcf-bf70-8cf36630c3ba-nftmonkey.jpeg';
			user.name = createUserDto.email.split('@')[0];
			user.bio = 'I have no bio';
			user.phone = '';
			user.password = await this.authService.hashPassword(createUserDto.password);
			user.email = createUserDto.email;

			try {
				const result = await this.userRepository.save(user);
				this.channelsGateway.joinWelcomeChannel(result);
			} catch (error) {
				console.debug('database failure : ', error);
				throw new BadRequestException('Internal servor error');
			}

			const accessToken = {
				token: this.authService.generateAccessToken(user.id),
				iat: Date.now() + 86400000,
			};
			const refreshToken = this.authService.generateRefreshToken(user.id);

			return response
				.cookie('refreshToken', refreshToken, {
					httpOnly: true,
				})
				.json({ accessToken });
		} catch (error) {
			return response.status(500).json(error);
		}
	}
}
