import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatalogEntity } from './entity/catalog.entity';
import { Repository } from 'typeorm';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { ProductEntity } from 'src/products/entities/product.entity';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(CatalogEntity)
    private readonly catalogRepo: Repository<CatalogEntity>,
  ) {}

  async findAll(): Promise<CatalogEntity[]> {
    return await this.catalogRepo.find();
  }

  async findOne(id: number): Promise<CatalogEntity> {
    const catalog = await this.catalogRepo.findOne({ where: { id: id } });

    if (!catalog) {
      throw new NotFoundException(`Catalog with ID:${id} not found`);
    }

    return catalog;
  }

  async create(createCatalogDto: CreateCatalogDto): Promise<CatalogEntity> {
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

  async getProducts(catalogId: number): Promise<ProductEntity[]> {
    const catalog = await this.catalogRepo.findOne({
      where: { id: catalogId },
      relations: ['products'],
    });
    if (!catalog) {
      throw new NotFoundException(`Catalog with ID:${catalogId} not found`);
    }
    return catalog.products;
  }
}
