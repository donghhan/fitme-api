import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions } from './interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    @Inject('OPTIONS') private readonly options: JwtModuleOptions,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: object): string {
    return jwt.sign(
      payload,
      this.configService.get<string>('TOKEN_SECRET_KEY'),
    );
  }

  verify(token: string) {
    return jwt.verify(
      token,
      this.configService.get<string>('TOKEN_SECRET_KEY'),
    );
  }
}
