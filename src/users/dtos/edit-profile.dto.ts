import { ObjectType, PartialType, OmitType, InputType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class UpdateProfileInput extends PartialType(
  OmitType(User, ['role'] as const),
) {}

@ObjectType()
export class UpdateProfileOutput extends MutationOutput {}
