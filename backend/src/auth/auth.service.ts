import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
	public generateAccessToken(userId: number) {
		return jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '1d',
		});
	}

	public generateRefreshToken(userId: number) {
		return jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET);
	}

	public async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, 10);
	}

	public extractRefreshToken(request) {
		const refreshToken = request.rawHeaders
			.map((header, index) => {
				if (header === 'Cookie' && request.rawHeaders[index + 1]) {
					const cookies = request.rawHeaders[index + 1].split(';');
					const refreshTokenCookie = cookies.find((cookie) => cookie.includes('refreshToken='));
					if (refreshTokenCookie) {
						return refreshTokenCookie.split('=')[1];
					}
				}
			})
			.filter(Boolean)[0];
		return refreshToken;
	}
}
