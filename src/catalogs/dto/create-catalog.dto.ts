import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCatalogDto {
  @ApiProperty({
    example: "Electronics",
    description: "The title name of the catalog",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: "All electronic gadgets and devices",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string = "";

  @ApiProperty({
    example: true,
    required: false,
    description: "if the catalog is currently visible or not",
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
