import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCatalogDto } from "./dto/create-catalog.dto";
import { UpdateCatalogDto } from "./dto/update-catalog.dto";
import { CatalogEntity } from "../database/entities/catalog.entity";
import { PaginationCatalogDto } from "./dto/pagination-catalog.dto";

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(CatalogEntity)
    private readonly catalogRepo: Repository<CatalogEntity>,
  ) {}

  async findAll(paginationDto: PaginationCatalogDto): Promise<CatalogEntity[]> {                                                                                                                                                                                         
    const { page = 1, limit = 50 } = paginationDto;                                                                                                                                                                                                                      
    return this.catalogRepo.find({                                                                                                                                                                                                                                       
      skip: (page - 1) * limit,                                                                                                                                                                                                                                          
      take: limit,                                                                                                                                                                                                                                                       
      order: { id: "ASC" },                                                                                                                                                                                                                                              
    });                                                                                                                                                                                                                                                                  
  }    

  async findOne(id: number): Promise<CatalogEntity> {
    const catalog = await this.catalogRepo.findOne({ where: { id: id } });
    if (!catalog) {
      throw new NotFoundException(`Catalog with ID:${id} not found`);
    }
    return catalog;
  }

  async create(createCatalogDto: CreateCatalogDto): Promise<CatalogEntity> {
    const existingCatalog = await this.catalogRepo.findOne({
      where: { name: createCatalogDto.name },
    });

    if (existingCatalog) {
      throw new ConflictException(
        `Catalog with name "${createCatalogDto.name}" already exists`,
      );
    }
    const catalog = this.catalogRepo.create(createCatalogDto);
    return await this.catalogRepo.save(catalog);
  }

  async update(
    id: number,
    updateCatalogDto: UpdateCatalogDto,
  ): Promise<CatalogEntity> {
    await this.findOne(id);
    await this.catalogRepo.update(id, updateCatalogDto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<CatalogEntity> {
    const deletedCatalog = await this.findOne(id);
    await this.catalogRepo.delete(id);
    return deletedCatalog;
  }
}
