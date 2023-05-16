import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutputDto } from 'src/common/dtos/output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends MutationOutputDto {
  @Field((type) => String, { nullable: true })
  token?: string;
}
