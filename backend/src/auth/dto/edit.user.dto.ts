import { Length, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  photo?: string;

  @Length(2)
  @IsOptional()
  name?: string;

  @Length(2)
  @IsOptional()
  bio?: string;

  @Length(10)
  @IsOptional()
  phone?: string;

  @Length(8)
  @IsOptional()
  password?: string;
}