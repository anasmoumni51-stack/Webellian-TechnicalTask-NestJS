import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../src/products/products.service';
import { ProductEntity } from '../src/database/entities/product.entity';
import { CatalogEntity } from '../src/database/entities/catalog.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCatalogRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(CatalogEntity),
          useValue: mockCatalogRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockResult = [{ id: 1, name: 'Phone', price: 999.0 }];
      mockProductRepo.find.mockResolvedValue(mockResult);
      expect(await service.findAll()).toEqual(mockResult);
    });
  });

  describe('assignToCatalog', () => {
    it('should assign a product to a catalog and save the change', async () => {
      const product = { id: 1, name: 'Phone', catalogs: [] };
      const catalog = { id: 2, name: 'Electronics' };

      mockProductRepo.findOne.mockResolvedValue(product);
      mockCatalogRepo.findOne.mockResolvedValue(catalog);

      // saving the updated product
      const updatedProduct = { ...product, catalogs: [catalog] };
      mockProductRepo.save.mockResolvedValue(updatedProduct);

      const result = await service.assignToCatalog(1, 2);
      expect(result.catalogs.length).toBe(1);
      expect(mockProductRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product is missing', async () => {
      mockProductRepo.findOne.mockResolvedValue(null);
      await expect(service.assignToCatalog(999, 2)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if catalog is missing', async () => {
      mockProductRepo.findOne.mockResolvedValue({
        id: 1,
        name: 'Phone',
        catalogs: [],
      });
      mockCatalogRepo.findOne.mockResolvedValue(null);
      await expect(service.assignToCatalog(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if already assigned', async () => {
      const catalog = { id: 2, name: 'Electronics' };
      const product = { id: 1, name: 'Phone', catalogs: [catalog] }; // Already has catalog ID 2

      mockProductRepo.findOne.mockResolvedValue(product);
      mockCatalogRepo.findOne.mockResolvedValue(catalog);

      await expect(service.assignToCatalog(1, 2)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteFromCatalog', () => {
    it('should remove a product from a catalog and save the change', async () => {
      const catalog = { id: 2, name: 'Electronics' };
      const product = { id: 1, name: 'Phone', catalogs: [catalog] };

      mockProductRepo.findOne.mockResolvedValue(product);
      mockProductRepo.save.mockResolvedValue({ ...product, catalogs: [] });

      const result = await service.deleteFromCatalog(1, 2);
      expect(result.catalogs.length).toBe(0);
    });

    it('should throw ConflictException if trying to remove an unassigned catalog', async () => {
      const catalog = { id: 2, name: 'Electronics' };
      const product = { id: 1, name: 'Phone', catalogs: [catalog] };

      mockProductRepo.findOne.mockResolvedValue(product);

      // remove catalog 3 (which isn't assigned)
      await expect(service.deleteFromCatalog(1, 3)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
