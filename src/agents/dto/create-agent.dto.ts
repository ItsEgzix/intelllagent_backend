import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsOptional()
  userId?: string; // If provided, set this user as agent

  @IsString()
  @IsOptional()
  name?: string; // Required only if creating new user

  @IsEmail()
  @IsOptional()
  email?: string; // Required only if creating new user

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAgent?: boolean;
}
