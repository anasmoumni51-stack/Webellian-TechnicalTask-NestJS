import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCatalogDto {

    @IsString()
    @MinLength(2)
    @MaxLength(10)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    description?: string = "";

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}