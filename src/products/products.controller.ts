import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "../database/entities/product.entity";
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @ApiOperation({ summary: "Retrieve all products" })
  @ApiResponse({
    status: 200,
    description:
      "List of all products successfully retrieved ( assigned catalogs are not included )",
    type: [ProductEntity],
  })
  @Get()
  async retrieveAllProducts(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: "Retrieve a single product" })
  @ApiParam({
    name: "id",
    description: "The ID of the product",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Product successfully retrieved",
    type: ProductEntity,
  })
  @ApiNotFoundResponse({ description: "Product not found" })
  @Get(":id")
  async retrieveOneProduct(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: "Create a new product (must be unique)" })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: "Product successfully created",
    type: ProductEntity,
  })
  @ApiConflictResponse({ description: "Product with this name already exists" })
  @Post()
  async createProduct(
    @Body() productDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.create(productDto);
  }

  @ApiOperation({ summary: "Update a product" })
  @ApiParam({
    name: "id",
    description: "The ID of the product to update",
    type: "number",
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: "Product successfully updated",
    type: ProductEntity,
  })
  @ApiNotFoundResponse({ description: "Product not found" })
  @ApiConflictResponse({ description: "Product name already exists" })
  @Put(":id")
  async updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: "Delete a product" })
  @ApiParam({
    name: "id",
    description: "The ID of the product to delete",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Product successfully deleted",
    type: ProductEntity,
  })
  @ApiNotFoundResponse({ description: "Product not found" })
  @Delete(":id")
  async deleteProduct(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return this.productService.delete(id);
  }

  @ApiOperation({ summary: "Assign a product to a catalog" })
  @ApiParam({
    name: "id",
    description: "The ID of the product",
    type: "number",
  })
  @ApiParam({
    name: "catalogId",
    description: "The ID of the catalog to link",
    type: "number",
  })
  @ApiResponse({
    status: 201,
    description: "Product successfully assigned to catalog",
    type: ProductEntity,
  })
  @ApiNotFoundResponse({ description: "Product or Catalog not found" })
  @Post(":id/catalogs/:catalogId")
  async assignProductToCatalog(
    @Param("id", ParseIntPipe) id: number,
    @Param("catalogId", ParseIntPipe) catalogId: number,
  ): Promise<ProductEntity> {
    return this.productService.assignToCatalog(id, catalogId);
  }

  @ApiOperation({ summary: "Remove a product from a catalog" })
  @ApiParam({
    name: "id",
    description: "The ID of the product",
    type: "number",
  })
  @ApiParam({
    name: "catalogId",
    description: "The ID of the catalog to disconnect from",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Product successfully removed from catalog",
    type: ProductEntity,
  })
  @ApiNotFoundResponse({
    description: "Product or Catalog not found, or not currently linked",
  })
  @Delete(":id/catalogs/:catalogId")
  async removeProductFromCatalog(
    @Param("id", ParseIntPipe) id: number,
    @Param("catalogId", ParseIntPipe) catalogId: number,
  ): Promise<ProductEntity> {
    return this.productService.deleteFromCatalog(id, catalogId);
  }
}
