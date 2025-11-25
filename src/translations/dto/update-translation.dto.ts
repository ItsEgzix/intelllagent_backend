import { IsObject, IsString, IsOptional } from 'class-validator';

export class UpdateTranslationDto {
  @IsObject()
  data!: Record<string, any>;

  @IsString()
  @IsOptional()
  nativeName?: string;

  @IsString()
  @IsOptional()
  englishName?: string;
}
