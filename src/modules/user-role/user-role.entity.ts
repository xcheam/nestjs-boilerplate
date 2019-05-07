import { UPDATE } from '@nestjsx/crud'
import { IsOptional } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('UserRole')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number

  @IsOptional(UPDATE)
  @Column({ length: 128, unique: true })
  name: string

  @IsOptional(UPDATE)
  @Column({ default: false })
  isActive?: boolean
}
