import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMeetingDto {
  // Customer information
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  timezone: string; // Customer's timezone

  // Meeting time (in customer's timezone)
  @IsString()
  @IsNotEmpty()
  date: string; // Customer's date (YYYY-MM-DD)

  @IsString()
  @IsNotEmpty()
  time: string; // Customer's time (HH:mm)

  // Agent assignment
  @IsString()
  @IsOptional()
  agentId?: string;
}
