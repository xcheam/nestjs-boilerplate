import { UPDATE } from '@nestjsx/crud'
import { IsEmail, IsNumber, IsOptional, Length } from 'class-validator'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { UserRole } from '../user-role/user-role.entity'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @IsOptional(UPDATE)
  @Length(5, 60)
  @Column({ length: 60, unique: true })
  username: string

  @IsOptional(UPDATE)
  @IsEmail()
  @Column({ length: 256, unique: true })
  email: string

  @IsOptional(UPDATE)
  @Length(5, 60)
  @Column({ type: 'char', length: 60 })
  password: string

  @IsOptional(UPDATE)
  @Length(1, 128)
  @Column({ length: 128 })
  fullName: string

  @IsOptional(UPDATE)
  @IsNumber()
  @Column({ unique: false })
  roleId: number

  @IsOptional(UPDATE)
  @Column({ default: false })
  isActive?: boolean

  @OneToOne(() => UserRole, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn()
  role?: UserRole
}
