import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '~/modules/Auth/entities/User'
import { findUserById } from '~/modules/Auth/loaders/user'

@ObjectType()
@Entity()
export class Animal extends BaseEntity {
  static get className() {
    return 'Animal'
  }

  static get belongsToUser() {
    return true
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  species: string

  @Field()
  @Column()
  uri: string

  @Column()
  userId: number

  @ManyToOne(() => User, user => user.animalConnection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userConnection: User

  @Field(() => User, { complexity: 5 })
  user(): Promise<User> {
    return findUserById(this.userId)
  }
}
