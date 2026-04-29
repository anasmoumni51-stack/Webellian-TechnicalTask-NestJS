import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CatalogsService } from "./catalogs.service";
import { CreateCatalogDto } from "./dto/create-catalog.dto";
import { UpdateCatalogDto } from "./dto/update-catalog.dto";
import { CatalogEntity } from "../database/entities/catalog.entity";
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaginationCatalogDto } from "./dto/pagination-catalog.dto";

@ApiTags("Catalogs")
@Controller("catalogs")
export class CatalogsController {
  constructor(private readonly catalogService: CatalogsService) {}

  @ApiOperation({ summary: "Retrieve all catalogs (paginated)" })
  @ApiResponse({
    status: 200,
    description:
      "List of all catalogs successfully retrieved and paginated ( products inside the catalog are not included in this response)",
    type: [CatalogEntity],
  })
  @Get()
  async retrieveAllCatalogs(@Query() paginationCatalogDto : PaginationCatalogDto): Promise<CatalogEntity[]> {
    return this.catalogService.findAll(paginationCatalogDto);
  }

  @ApiOperation({ summary: "Retrieve one catalog" })
  @ApiParam({
    name: "id",
    description: "The ID of the catalog",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Catalog successfully retrieved",
    type: CatalogEntity,
  })
  @ApiNotFoundResponse({ description: "Catalog not found" })
  @Get(":id")
  async retrieveOneCatalog(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CatalogEntity> {
    return this.catalogService.findOne(id);
  }

  @ApiOperation({ summary: "Create a new catalog (must be unique)" })
  @ApiBody({ type: CreateCatalogDto })
  @ApiResponse({
    status: 201,
    description: "Catalog successfully created",
    type: CatalogEntity,
  })
  @ApiConflictResponse({
    description: "Catalog with this title already exists",
  })
  @Post()
  async createCatalog(
    @Body() catalogDTO: CreateCatalogDto,
  ): Promise<CatalogEntity> {
    return this.catalogService.create(catalogDTO);
  }

  @ApiOperation({ summary: "Update a catalog" })
  @ApiParam({
    name: "id",
    description: "The ID of the catalog to update",
    type: "number",
  })
  @ApiBody({ type: UpdateCatalogDto })
  @ApiResponse({
    status: 200,
    description: "Catalog successfully updated",
    type: CatalogEntity,
  })
  @ApiNotFoundResponse({ description: "Catalog not found" })
  @ApiConflictResponse({ description: "Catalog title already exists" })
  @Put(":id")
  async updateCatalog(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCatalog: UpdateCatalogDto,
  ): Promise<CatalogEntity> {
    return this.catalogService.update(id, updateCatalog);
  }

  @ApiOperation({ summary: "Delete a catalog" })
  @ApiParam({
    name: "id",
    description: "The ID of the catalog to delete",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Catalog successfully deleted",
    type: CatalogEntity,
  })
  @ApiNotFoundResponse({ description: "Catalog not found" })
  @Delete(":id")
  async deleteCatalog(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CatalogEntity> {
    return this.catalogService.delete(id);
  }
}
