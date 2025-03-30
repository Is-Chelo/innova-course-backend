import {
  IsBoolean,
  IsInt,
  isInt,
  IsNumber,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  description: string;

  @IsInt()
  @IsOptional()
  stock: number;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  enable: boolean;

  @IsString()
  image: string;

  @IsString()
  categoryId: string;
}
