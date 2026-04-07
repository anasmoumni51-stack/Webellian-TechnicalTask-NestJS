import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'MacBook Pro',
    description: 'The title name of the product',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    example: 1999.99,
    description:
      'Product price in any currency (Formatting not yet implemented)',
  })
  @IsNumber()
  @Min(0)
  @Max(99999)
  price!: number;

  @ApiProperty({ example: 'A high-end laptop for developers', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string = '';

  @ApiProperty({
    example: true,
    required: false,
    description: 'if the product is available in stock or not (optional)',
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;
}
