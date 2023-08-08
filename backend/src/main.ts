import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Channel } from './channel/channel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: ['http://chatgroup-bucket.s3-website.eu-west-3.amazonaws.com', 'http://localhost:3000', 'http://localhost:3001'],
		credentials: true,
	});

	app.useGlobalPipes(new ValidationPipe());

	const channelRepository = app.get<Repository<Channel>>(getRepositoryToken(Channel));
	const welcomeChannel = await channelRepository.findOne({
		where: { name: 'welcome' },
	});
	if (!welcomeChannel) {
		const newWelcomeChannel = new Channel();
		newWelcomeChannel.name = 'Welcome';
		newWelcomeChannel.description = 'Welcome to Chat Group!';
		newWelcomeChannel.users = [];
		await channelRepository.save(newWelcomeChannel);
	}

	const port = 3000;
	await app.listen(port);
}

bootstrap();
