import { ApiModelProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class AuthBody {
  @ApiModelProperty({
    example: 'test'
  })
  identifier?: string

  @ApiModelProperty({
    example: 'test'
  })
  @IsString()
  @Length(5, 32)
  password: string
}
