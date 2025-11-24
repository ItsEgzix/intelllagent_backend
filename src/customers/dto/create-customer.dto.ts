import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  timezone: string;

  @IsString()
  @IsOptional()
  companyDetails?: string;

  @IsString()
  @IsOptional()
  level?: string; // "new", "contacted", "responded", "qualified", "customer"
}
