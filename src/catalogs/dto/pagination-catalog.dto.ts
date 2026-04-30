import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";

export class PaginationCatalogDto {                                                                                                                                                                                                                                           
    @ApiPropertyOptional({
      description: "Page number (1-based)",
      example: 1,                                                                                                                                                                                                                                                        
      default: 1,
    })                                                                                                                                                                                                                                                                   
    @IsOptional()
    @IsNumber()                                                                                                                                                                                                                                                     
    @Min(1)                                                                                                                                                                                                                                                           
    page?: number = 1;                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                         
    @ApiPropertyOptional({                                                                                                                                                                                                                                               
      description: "Number of items per page",                                                                                                                                                                                                                           
      example: 10,                                                                                                                                                                                                                                                       
      default: 10,                                                                                                                                                                                                                                                       
    })                                                                                                                                                                                                                                                        
    @IsOptional()                                                                                                                                                                                                                                                        
    @IsNumber()                                                                                                                                                                                                                                                     
    @Min(1)                                                                                                                                                                                                                                                             
    @Max(100)                                                                                                                                                                                                                                                            
    limit?: number = 10;                                                                                                                                                                                                                                            
  }