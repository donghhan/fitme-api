import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/createAccount.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
    mobileNumber,
    firstName,
    lastName,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
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
}
