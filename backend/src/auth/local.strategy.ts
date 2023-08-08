import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: username },
    });

    if (!user) {
      // this.logger.debug(`User ${username} not found`);
      throw new UnauthorizedException(`User ${username} not found`);
    }

    if (!(await bcrypt.compare(password, user.password))) {
      // this.logger.debug(`Wrong password`);
      throw new UnauthorizedException(`Wrong password`);
    }

    return user;
  }
}
