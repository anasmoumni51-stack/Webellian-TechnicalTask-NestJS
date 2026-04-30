import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationProductDto } from "./pagination-product.dto";
import { IsNumber, IsOptional, Min } from "class-validator";

export class QueryProductDto extends PaginationProductDto {
  @ApiPropertyOptional({
    description: "Filter products by catalog ID",
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  catalogId?: number;
}
