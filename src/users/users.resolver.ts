import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import {
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query((returns) => UserProfileOutput)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (error: any) {
      return {
        ok: false,
        error: 'User not found.',
      };
    }
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(@Args('input') createAccountInput: CreateAccountInput) {
    try {
      const { ok, error } = await this.usersService.createAccount(
        createAccountInput,
      );
      return { ok, error };
    } catch (error: any) {
      return {
        ok: false,
        error,
      };
    }
  }

  // Logging in User
  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.usersService.login(loginInput);
    } catch (error: any) {
      return { ok: false, error };
    }
  }

  @Mutation((returns) => UpdateProfileOutput)
  @UseGuards(AuthGuard)
  async updateUserProfile(
    @AuthUser() authUser: User,
    @Args('input') updateProfileInput: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      await this.usersService.updateProfile(authUser.id, updateProfileInput);
      return {
        ok: true,
      };
    } catch (error: any) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmail(@Args('input') { code }: VerifyEmailInput) {
    try {
      await this.usersService.verifyEmail(code);
      return { ok: true };
    } catch (error: any) {
      return {
        ok: false,
        error,
      };
    }
  }
}
