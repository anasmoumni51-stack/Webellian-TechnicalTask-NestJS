import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Controller('catalogs')
export class CatalogsController {

    constructor(private readonly catalogService : CatalogsService ) {}

@Get()
retrieveAllCatalogs() {
    return 'all catalogs'
}

@Get(':id')
retrieveOneCatalog (@Param('id', ParseIntPipe) id: number) {
    return id
}


@Post()
createCatalog(@Body(ValidationPipe) catalogDTO: CreateCatalogDto ) {
    return catalogDTO;
}


@Put(':id')
updateCatalog(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateCatalog: UpdateCatalogDto) {
    return {id, updateCatalog};
}


@Delete(':id')
deleteCatalog(@Param('id', ParseIntPipe) id: number) {
    return id;
}



}
