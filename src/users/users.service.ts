import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/createAccount.dto';
import { LoginInput } from './dtos/login.dto';
import { CreateAccountProps, LoginProps } from './interfaces/users.interface';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
    mobileNumber,
    firstName,
    lastName,
  }: CreateAccountInput): Promise<CreateAccountProps> {
    // Check if email address is already taken
    try {
      const existingUser = await this.users.findOne({
        where: { email },
      });
      if (existingUser) {
        return { ok: false, error: 'Email is already taken.' };
      }

      await this.users.save(
        this.users.create({
          email,
          password,
          role,
          mobileNumber,
          firstName,
          lastName,
        }),
      );
      return { ok: true };
    } catch (errors: any) {
      return {
        ok: false,
        error: "Couldn't create account due to unknown error. Try again later.",
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginProps> {
    // Find a user with email
    try {
      const userWithEmail = await this.users.findOne({ where: { email } });
      if (!userWithEmail) {
        return { ok: false, error: 'User not found.' };
      }

      const passwordCorrect = await userWithEmail.checkHashedPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Password does not match.' };
      }

      const token = this.jwtService.sign({ id: userWithEmail.id });

      return {
        ok: true,
        token,
      };
    } catch (error: any) {
      return { ok: false, error };
    }
  }
}
