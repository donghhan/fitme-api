import { BeforeInsert, Column, Entity } from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { CommonEntity } from 'src/common/entities/common.entity';
import { InternalServerErrorException } from '@nestjs/common';

enum RoleType {
  Admin,
  Client,
  Delivery,
}

registerEnumType(RoleType, { name: 'RoleType' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CommonEntity {
  @Field((type) => String)
  @Column()
  firstName: string;

  @Field((type) => String)
  @Column()
  lastName: string;

  @Field((type) => String)
  @Column()
  email: string;

  @Field((type) => RoleType)
  @Column()
  role: RoleType;

  @Field((type) => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field((type) => String)
  @Column()
  password: string;

  @Field((type) => String, { nullable: true })
  @Column()
  mobileNumber: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkHashedPassword(userPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(userPassword, this.password);
      return ok;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
