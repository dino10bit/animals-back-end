import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { RefreshToken } from '~/modules/Auth/entities/RefreshToken'
import { Animal } from '~/modules/Animal/entities/Animal'
import { findAnimalsByUserId } from '~/modules/Animal/loaders/animal'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @Column('text', { unique: true })
  email: string

  @Column()
  password: string

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: Promise<RefreshToken[]>

  @OneToMany(() => Animal, animal => animal.userConnection)
  animalConnection: Promise<Animal[]>

  @Field(() => [Animal], { nullable: true, complexity: 5 })
  animals(): Promise<Animal[] | []> {
    return findAnimalsByUserId(this.id)
  }
}
