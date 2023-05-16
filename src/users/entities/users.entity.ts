import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Field } from '@nestjs/graphql';

type RoleType = 'admin' | 'customer' | 'delivery';

export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

@Entity()
export class User extends CommonEntity {
  @Field()
  @Column((type) => Name)
  name: Name;

  @Column()
  email: string;

  @Column()
  role: RoleType;

  @Column()
  isActive: boolean;

  @Field({ nullable: true })
  @Column()
  mobileNumber: string;
}
