import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/createAccount.dto';
import { LoginInput } from './dtos/login.dto';
import { CreateAccountProps, LoginProps } from './interfaces/users.interface';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
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

      const user = await this.users.save(
        this.users.create({
          email,
          password,
          role,
          mobileNumber,
          firstName,
          lastName,
        }),
      );

      // Creating verification
      await this.verifications.save(
        this.verifications.create({
          user,
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
      const userWithEmail = await this.users.findOne({
        where: { email },
        select: ['password', 'id'],
      });
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

  async findById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async updateProfile(
    userId: number,
    { mobileNumber, firstName, lastName, password, email }: UpdateProfileInput,
  ) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (mobileNumber) {
      user.mobileNumber = mobileNumber;
    }
    if (password) {
      user.password = password;
    }
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      throw new Error();
    } catch (error: any) {
      console.log(error);
      return { ok: false, error };
    }
  }
}
