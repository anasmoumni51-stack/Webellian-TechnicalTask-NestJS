import { IsBoolean, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
    
    @IsString()
    @MinLength(2)
    @MaxLength(10)
    name!: string;

    @IsNumber()
    @Min(0)
    @Max(99999)
    price!: number;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    description? : string = "";

    
    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean= true;

}