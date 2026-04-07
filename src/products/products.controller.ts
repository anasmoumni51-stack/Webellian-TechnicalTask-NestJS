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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async retrieveAllProducts(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async retrieveOneProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }

  @Post()
  async createProduct(
    @Body() productDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.create(productDto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return this.productService.delete(id);
  }

  @Post(':id/catalogs/:catalogId')
  async assignProductToCatalog(
    @Param('id', ParseIntPipe) id: number,
    @Param('catalogId', ParseIntPipe) catalogId: number,
  ): Promise<ProductEntity> {
    return this.productService.assignToCatalog(id, catalogId);
  }

  @Delete(':id/catalogs/:catalogId')
  async removeProductFromCatalog(
    @Param('id', ParseIntPipe) id: number,
    @Param('catalogId', ParseIntPipe) catalogId: number,
  ): Promise<ProductEntity> {
    return this.productService.deleteFromCatalog(id, catalogId);
  }
}
