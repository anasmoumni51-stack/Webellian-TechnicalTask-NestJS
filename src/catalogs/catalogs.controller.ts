import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { CatalogEntity } from '../database/entities/catalog.entity';
import { ProductEntity } from '../database/entities/product.entity';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogService: CatalogsService) {}

  @Get()
  async retrieveAllCatalogs(): Promise<CatalogEntity[]> {
    return this.catalogService.findAll();
  }

  @Get(':id')
  async retrieveOneCatalog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CatalogEntity> {
    return this.catalogService.findOne(id);
  }

  @Post()
  async createCatalog(
    @Body() catalogDTO: CreateCatalogDto,
  ): Promise<CatalogEntity> {
    return this.catalogService.create(catalogDTO);
  }

  @Put(':id')
  async updateCatalog(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatalog: UpdateCatalogDto,
  ): Promise<CatalogEntity> {
    return this.catalogService.update(id, updateCatalog);
  }

  @Delete(':id')
  async deleteCatalog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CatalogEntity> {
    return this.catalogService.delete(id);
  }

  @Get(':id/products')
  async getProductsInCatalog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity[]> {
    return this.catalogService.getProducts(id);
  }
}
