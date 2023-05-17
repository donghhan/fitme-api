import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/users.entity';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'firstName',
  'lastName',
  'role',
  'mobileNumber',
]) {}

@ObjectType()
export class CreateAccountOutput extends MutationOutput {}
