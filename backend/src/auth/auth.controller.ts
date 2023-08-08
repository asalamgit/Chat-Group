import { ClassSerializerInterceptor, SerializeOptions, Controller, Post, Get, UseInterceptors, UploadedFile, UseGuards, Res, Body, Req, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/edit.user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';

interface IUploadedFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	destination: string;
	filename: string;
	path: string;
	size: number;
}

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	@Post('login')
	@UseGuards(AuthGuardLocal)
	async login(@CurrentUser() user: User, @Res() response: Response) {
		const accessToken = {
			token: this.authService.generateAccessToken(user.id),
			iat: Date.now() + 86400000,
		};

		const refreshToken = this.authService.generateRefreshToken(user.id);

		return response
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'none',
			})
			.json({ userId: user.id, accessToken });
	}

	@Post('logout')
	@UseGuards(AuthGuardJwt)
	logout(@Res() response: Response) {
		return response.clearCookie('refreshToken').json({ message: 'Logout successful' });
	}

	@Get('profile')
	@UseGuards(AuthGuardJwt)
	@UseInterceptors(ClassSerializerInterceptor)
	async getProfile(@CurrentUser() user: User) {
		return user;
	}

	@Post('profile')
	@UseGuards(AuthGuardJwt)
	@UseInterceptors(ClassSerializerInterceptor)
	@UseInterceptors(FileInterceptor('image'))
	async setProfile(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: any) {
		const existingUser = await this.userRepository.findOne({
			where: { id: user.id },
		});

		if (file) existingUser.photo = file.path;
		if (updateUserDto.name) {
			const existingUser2 = await this.userRepository.findOne({
				where: [{ name: updateUserDto.name }],
			});
			if (existingUser2) {
				throw new BadRequestException('Username is already taken');
			}
			existingUser.name = updateUserDto.name;
		}
		if (updateUserDto.bio) existingUser.bio = updateUserDto.bio;
		if (updateUserDto.phone) existingUser.phone = updateUserDto.phone;
		if (updateUserDto.password) existingUser.password = await this.authService.hashPassword(updateUserDto.password);

		const updatingUser = await this.userRepository.save(existingUser);

		return updatingUser;
	}

	@Get('getAccessToken')
	async generateNewAccessToken(@Req() request: Request, @Res() response: Response) {
		const refreshToken = this.authService.extractRefreshToken(request);

		if (refreshToken === undefined) {
			console.log('refreshToken is undefined');
			return response.sendStatus(401);
		}

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) {
				console.log('error = ', err);
				return response.sendStatus(403);
			} else {
				const accessToken = {
					token: this.authService.generateAccessToken(user.id),
					iat: Date.now() + 86400000,
				};
				return response.status(201).json(accessToken);
			}
		});
	}
}
