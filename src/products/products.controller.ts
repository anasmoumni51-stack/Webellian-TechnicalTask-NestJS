import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductsService) {}

@Get()
retrieveAllProducts () {
    return 'all products'
}

@Get(':id')
retrieveOneProduct (@Param('id', ParseIntPipe) id: number) {
    return id
}


@Post()
createProduct(@Body(ValidationPipe) productDto: CreateProductDto  ) {
    return productDto;
}


@Put(':id')
updateProduct(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) partialProductDto: UpdateProductDto) {
    return {id, partialProductDto};
}


@Delete(':id')
deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return id;
}




}
