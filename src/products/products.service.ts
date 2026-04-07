import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from '../database/entities/product.entity';
import { CatalogEntity } from '../database/entities/catalog.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(CatalogEntity)
    private readonly catalogRepo: Repository<CatalogEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepo.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({ where: { id: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID: ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const alreadyExists = await this.productRepo.findOne({
    where: { name: createProductDto.name },
  });

  if (alreadyExists) {
    throw new ConflictException(
      `Product with name "${createProductDto.name}" already exists`,
    );
  }
    const product = this.productRepo.create(createProductDto);
    return await this.productRepo.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    await this.findOne(id);
    await this.productRepo.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<ProductEntity> {
    const deleteproduct = await this.findOne(id);
    await this.productRepo.delete(id);
    return deleteproduct; // deleted product is returned for confirmation
  }

  // both repositories are called again because both services don't return joined tables by default for performance reasons;
  async assignToCatalog(
    productId: number,
    catalogId: number,
  ): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['catalogs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID: ${productId} not found`);
    }

    const catalog = await this.catalogRepo.findOne({
      where: { id: catalogId },
    });
    if (!catalog) {
      throw new NotFoundException(`Catalog with ID: ${catalogId} not found`);
    }

    const alreadyAssigned = product.catalogs.find(
      (catalog) => catalog.id === catalogId,
    );

    if (alreadyAssigned) {
      throw new ConflictException(
        `Product with ID ${productId} is already assigned to catalog with ID: ${catalogId}`,
      );
    }

    product.catalogs.push(catalog);
    return await this.productRepo.save(product);
  }

  async deleteFromCatalog(
    productId: number,
    catalogId: number,
  ): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['catalogs'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID: ${productId} not found`);
    }

    const catalog = await this.catalogRepo.findOne({
      where: { id: catalogId },
    });
    if (!catalog) {
      throw new NotFoundException(`Catalog with ID: ${catalogId} not found`);
    }

    const alreadyAssigned = product.catalogs.find(
      (catalog) => catalog.id === catalogId,
    );

    if (!alreadyAssigned) {
      throw new NotFoundException(
        `Cannot Delete from Catalog: Product ID: ${productId} is not assigned to Catalog ID: ${catalogId}`,
      );
    }

    product.catalogs = product.catalogs.filter(
      (catalog) => catalog.id !== catalogId,
    );
    return await this.productRepo.save(product);
  }
}
