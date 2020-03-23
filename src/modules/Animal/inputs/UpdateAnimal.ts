import { Length } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateAnimalInput {
  @Field()
  id: number

  @Field()
  @Length(1, 255)
  name: string

  @Field()
  species: string

  @Field()
  uri: string
}
